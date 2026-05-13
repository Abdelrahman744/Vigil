import DOMPurify from 'isomorphic-dompurify';

/**
 * Express middleware that sanitizes all string values in req.body
 * using DOMPurify, stripping ALL HTML tags and attributes.
 * 
 * This prevents Stored XSS attacks where malicious HTML could be
 * persisted to the database and later rendered in emails or responses.
 */
export const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const key of Object.keys(req.body)) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = DOMPurify.sanitize(req.body[key], {
                    ALLOWED_TAGS: [],    // Strip ALL HTML tags
                    ALLOWED_ATTR: [],    // Strip ALL attributes
                });
            }
        }
    }
    next();
};
