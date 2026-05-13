import dns from 'dns/promises';
import { URL } from 'url';
import net from 'net';

/**
 * CIDR ranges that are considered private or reserved.
 * Requests to these ranges are blocked to prevent SSRF attacks
 * that could probe internal infrastructure or cloud metadata endpoints.
 */
const BLOCKED_CIDRS = [
    { base: [127, 0, 0, 0],     mask: 8  },  // 127.0.0.0/8   — Loopback
    { base: [10, 0, 0, 0],      mask: 8  },  // 10.0.0.0/8    — Private Class A
    { base: [172, 16, 0, 0],    mask: 12 },  // 172.16.0.0/12  — Private Class B
    { base: [192, 168, 0, 0],   mask: 16 },  // 192.168.0.0/16 — Private Class C
    { base: [169, 254, 0, 0],   mask: 16 },  // 169.254.0.0/16 — Link-local / AWS metadata
    { base: [0, 0, 0, 0],       mask: 8  },  // 0.0.0.0/8     — "This" network
    { base: [100, 64, 0, 0],    mask: 10 },  // 100.64.0.0/10  — Carrier-grade NAT
    { base: [192, 0, 0, 0],     mask: 24 },  // 192.0.0.0/24   — IETF Protocol Assignments
    { base: [198, 18, 0, 0],    mask: 15 },  // 198.18.0.0/15  — Benchmark testing
    { base: [224, 0, 0, 0],     mask: 4  },  // 224.0.0.0/4   — Multicast
    { base: [240, 0, 0, 0],     mask: 4  },  // 240.0.0.0/4   — Reserved/Future
];

/**
 * Blocked IPv6 addresses and prefixes.
 */
const BLOCKED_IPV6 = ['::1', '::ffff:127.0.0.1'];
const BLOCKED_IPV6_PREFIXES = ['fc', 'fd', 'fe80'];

/**
 * Convert a dotted IPv4 string to a 32-bit integer.
 */
function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

/**
 * Check if an IPv4 address falls within any blocked CIDR range.
 */
function isBlockedIPv4(ip) {
    const ipInt = ipToInt(ip);
    for (const { base, mask } of BLOCKED_CIDRS) {
        const baseInt = ipToInt(base.join('.'));
        const maskBits = (0xFFFFFFFF << (32 - mask)) >>> 0;
        if ((ipInt & maskBits) === (baseInt & maskBits)) {
            return true;
        }
    }
    return false;
}

/**
 * Check if an IPv6 address is blocked.
 */
function isBlockedIPv6(ip) {
    const lower = ip.toLowerCase();
    if (BLOCKED_IPV6.includes(lower)) return true;
    for (const prefix of BLOCKED_IPV6_PREFIXES) {
        if (lower.startsWith(prefix)) return true;
    }
    return false;
}

/**
 * Validates that a URL does not resolve to a private or reserved IP range.
 * This prevents SSRF attacks where an attacker could trick the server into
 * making requests to internal services (e.g., AWS metadata at 169.254.169.254).
 *
 * @param {string} urlString - The URL to validate.
 * @throws {Error} If the URL scheme is not HTTP/HTTPS, or if it resolves
 *                 to a private/reserved IP address.
 */
export async function validateUrlNotPrivate(urlString) {
    let parsed;
    try {
        parsed = new URL(urlString);
    } catch {
        throw new Error('Invalid URL format.');
    }

    // Only allow http and https schemes
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error(`Blocked scheme "${parsed.protocol}". Only HTTP and HTTPS are allowed.`);
    }

    const hostname = parsed.hostname;

    // If the hostname is already an IP address, check it directly
    if (net.isIPv4(hostname)) {
        if (isBlockedIPv4(hostname)) {
            throw new Error(`Blocked: "${hostname}" resolves to a private/reserved IP range.`);
        }
        return; // Valid public IPv4
    }

    if (net.isIPv6(hostname)) {
        if (isBlockedIPv6(hostname)) {
            throw new Error(`Blocked: "${hostname}" resolves to a private/reserved IPv6 address.`);
        }
        return; // Valid public IPv6
    }

    // Resolve the hostname to IP addresses via DNS
    let addresses;
    try {
        addresses = await dns.resolve4(hostname);
    } catch {
        // If IPv4 resolution fails, try IPv6
        try {
            addresses = await dns.resolve6(hostname);
            for (const addr of addresses) {
                if (isBlockedIPv6(addr)) {
                    throw new Error(`Blocked: "${hostname}" resolves to a private/reserved IPv6 address (${addr}).`);
                }
            }
            return; // All IPv6 addresses are public
        } catch {
            throw new Error(`DNS resolution failed for "${hostname}".`);
        }
    }

    // Check all resolved IPv4 addresses
    for (const addr of addresses) {
        if (isBlockedIPv4(addr)) {
            throw new Error(`Blocked: "${hostname}" resolves to a private/reserved IP address (${addr}).`);
        }
    }
}
