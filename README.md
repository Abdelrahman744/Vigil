# 🛡️ Vigil - Serverless Backend Monitoring API

Vigil is a professional-grade, serverless monitoring service designed to track website availability and performance in real-time. Built with Node.js and deployed on Vercel, it uses a distributed heartbeat system triggered by GitHub Actions to ensure your web services stay healthy.

## 🚀 Postman Collection
[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/49732434/2sBXcEjfcq)
*(Click above to view the complete API documentation and test the endpoints directly)*

---

## ✨ Core Features

* **Serverless Heartbeat:** Automated monitoring powered by GitHub Actions triggers, successfully bypassing serverless inactivity timeouts.
* **Smart Retry Mechanism:** Performs 3 retries with specific delays to eliminate false positives before declaring a service down.
* **Real-time Email Alerts:** Instant notifications via SMTP (Nodemailer) when a service becomes unresponsive.
* **Performance Analytics:** Calculates real-time Uptime percentages and average latency (ms) for every target.
* **Secure Multi-tenant API:** Core routes are protected by JWT (JSON Web Tokens) with a custom API key securing the cron tasks.
* **Auto-Cleanup:** Automated maintenance route that wipes logs older than 24 hours to optimize database storage.

---

## 🛠️ Technical Stack

* **Runtime:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Deployment:** Vercel (Serverless Functions)
* **Automation:** GitHub Actions (Cron Jobs)
* **Communication:** Axios (HTTP Pings), Nodemailer (Email Alerts)

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


--

☁️ Deployment Architecture
This API is designed to run in a stateless, serverless environment (Vercel). Because serverless functions sleep when inactive, the traditional node-cron package will not work.

To solve this, Vigil uses GitHub Actions as an external "alarm clock." A .yml workflow is configured to send a GET request to the /api/cron/heartbeat endpoint every 5 minutes, passing the CRON_SECRET in the headers to authenticate the request and trigger the monitoring cycle.

--

👨‍💻 Author

Abdelrahman Ashraf Software Engineering Student at Assiut University 

