# Vigil — Serverless Uptime Monitoring System

A modern web application for monitoring website availability and tracking uptime status.

Vigil allows users to register, log in, add websites to monitor, check their availability, view response times, and manage their monitoring targets through a clean and intuitive dashboard.

---

## 🚀 Project Overview

Vigil is a Serverless Uptime Monitoring System designed to help users monitor the availability and performance of websites and web services.

Users can create an account, securely log in, and manage multiple monitoring targets from a centralized dashboard.

The application displays important monitoring information such as:

- Total number of targets
- Active targets
- Down targets
- Current status of each website
- Response time
- Target management actions

---

## ✨ Features

### 🔐 Authentication

- User Registration
- User Login
- Secure authentication flow
- Protected dashboard access
- Logout functionality

### 📊 Monitoring Dashboard

The dashboard provides a complete overview of the user's monitoring targets.

Users can view:

- Total Targets
- Active Targets
- Down Targets
- Website Status
- Response Time

### 🎯 Target Management

Users can:

- Add a new monitoring target
- Add a target URL
- Add a target name
- View all monitoring targets
- Pause monitoring
- Activate monitoring
- Delete individual targets
- Delete all targets

### ⚡ Status Monitoring

Each target displays its current status:

- 🟢 Up
- 🔴 Down

The system also displays the response time for active targets.

### 🗑️ Delete Confirmation

To prevent accidental data loss, the application includes a confirmation dialog before deleting all targets.

### 🔔 User Notifications

The application includes a custom notification system to provide feedback for user actions.

Examples include:

- Successful actions
- Error messages
- Target updates
- Delete confirmations

---

## 🖥️ Application Screens

### 🔐 Login Page

Users can securely log into their accounts using their email and password.


Features:

- Email input
- Password input
- Login functionality
- Navigation to the registration page

<img width="1672" height="941" alt="ChatGPT Image Aug 29, 2026, 08_18_01 AM" src="https://github.com/user-attachments/assets/15fa35f3-3ec6-4967-b937-16b1decf3741" />

---

### 📝 Registration Page

New users can create an account by providing:

- Name
- Email
- Password

After registration, users can access the application and start managing their monitoring targets.

<img width="1672" height="941" alt="ChatGPT Image Aug 29, 2026, 08_17_57 AM" src="https://github.com/user-attachments/assets/a747a77a-36cb-438f-8545-9cff504bcea7" />


---

### 📊 Vigil Dashboard

The dashboard provides an overview of the monitoring system.

It displays:

- Total Targets
- Active Targets
- Down Targets

Users can also manage all their targets directly from the dashboard.

<img width="1536" height="1024" alt="ChatGPT Image Aug 29, 2026, 08_18_08 AM" src="https://github.com/user-attachments/assets/c0efbbd0-c53e-4af4-b958-cca2a874b91b" />


---

### 🎯 Targets Management

Users can add a new monitoring target by entering:

- Target URL
- Target Name

The target will then appear in the monitoring table.

---

### 📈 Target Status

Each target includes:

- URL
- Status
- Response Time
- Available Actions

Possible actions include:

- Pause
- Activate
- Delete

---

### 🗑️ Delete All Confirmation

Before permanently deleting all targets, the user receives a confirmation dialog.

This helps prevent accidental deletion of monitoring data.

<img width="1536" height="1024" alt="ChatGPT Image Aug 29, 2026, 08_18_04 AM" src="https://github.com/user-attachments/assets/98efee01-8d22-4e7c-b21e-a9c68f130d27" />


---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- CSS
- React Context API

### Backend

The backend was developed by another team member and handles:

- Authentication
- API endpoints
- Target management
- Monitoring logic
- Server-side functionality

---

## 📁 Project Structure

```text
src/
│
├── components/
│   ├── context/
│   │
│   ├── Auth.jsx
│   ├── Dashboard.jsx
│   ├── DeleteDialog.jsx
│   ├── SnackBar.jsx
│   └── Target.jsx
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
