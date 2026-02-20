# 🛡️ Vigil - Serverless Backend Monitoring API

Vigil is a professional-grade, serverless monitoring service designed to track website availability and performance in real-time. Built with Node.js and deployed on Vercel, it uses a distributed heartbeat system triggered by GitHub Actions to ensure your web services stay healthy.

### 🔗 Quick Links
* **Live Demo:** [Vigil API Registration](https://vigil-rust.vercel.app/api/signup)
* **API Documentation:** [![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/49732434/2sBXcEjfcq) *(Test endpoints directly)*

---

## 🏗️ Architecture Spotlight: The "Serverless" Solution

This API is designed to run in a stateless, serverless environment (Vercel). A common limitation of serverless functions (FaaS) is that they "sleep" when inactive, meaning traditional long-running tasks like `node-cron` fail to execute reliably.

**The Vigil Solution:** To circumvent this infrastructure constraint without paying for a dedicated VPS, Vigil utilizes **GitHub Actions** as an external, automated "heartbeat." A `.yml` workflow sends a scheduled `GET` request to the protected `/api/cron/heartbeat` endpoint. This wakes up the Vercel function, authenticates via a secure `CRON_SECRET` header, and safely executes the monitoring cycle.

---

## ✨ Core Features

* **Serverless Heartbeat:** Automated monitoring powered by GitHub Actions triggers, successfully bypassing serverless inactivity timeouts.
* **Smart Retry Mechanism:** Performs 3 retries with specific delays to eliminate false positives before declaring a service down.
* **Real-time Email Alerts:** Instant notifications via SMTP (Nodemailer) when a service becomes unresponsive.
* **Performance Analytics:** Calculates real-time Uptime percentages and average latency (ms) for every target.
* **Secure Multi-tenant API:** Core routes are protected by JWT (JSON Web Tokens) with a custom API key securing the automated cron tasks.
* **Auto-Cleanup:** Automated maintenance route that wipes logs older than 24 hours to optimize database storage.

---

## 🛠️ Technical Stack

* **Runtime:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Deployment:** Vercel (Serverless Functions)
* **Automation & CI/CD:** GitHub Actions
* **Communication:** Axios (HTTP Pings), Nodemailer (Email Alerts)
* **Security:** bcryptjs (Password Hashing), jsonwebtoken (Auth)

---

## 📡 API Reference

### Authentication (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/signup` | Create a new user account. |
| `POST` | `/api/login` | Authenticate and receive a JWT Bearer Token. |

### Target Management (Protected - Requires JWT)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/targets` | Add a new URL to monitor. |
| `GET` | `/api/targets` | List all monitored websites. |
| `GET` | `/api/targets/:id/stats` | View Uptime % and average latency stats. |
| `PATCH`| `/api/targets/:id/toggle` | Pause or Resume monitoring for a specific target. |
| `DELETE`| `/api/targets/:id` | Remove a target from the monitoring list. |

### Monitoring & Logs (Protected - Requires JWT)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/all` | View all historical ping logs. |
| `POST` | `/api/ping` | Manually check a URL once. |
| `DELETE`| `/api/clear` | Wipe all logs from the database. |

### System Triggers (Protected - Requires X-API-KEY)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cron/heartbeat` | Triggers a monitoring cycle (Used by GitHub Actions). |
| `GET` | `/api/cron/cleanup` | Triggers the 24-hour database log cleanup. |

---

## 👨‍💻 Author

**Abdelrahman Ashraf** *Backend-focused Software Engineering Student | Assiut University*