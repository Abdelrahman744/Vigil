import cron from 'node-cron';
import axios from 'axios';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; 
import Target from '../models/target.model.js';
import Monitor from '../models/monitor.model.js';
import { autoCleanup } from '../controllers/monitor.controller.js';

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

// Helper to send the alert email

const sendAlertEmail = async (targetName, url) => {
    const mailOptions = {
        from: `"Vigil Monitor" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // Sending alert to yourself
        subject: `⚠️ ALERT: ${targetName} is DOWN`,
        html: `<h3>Website Down Alert</h3>
               <p><strong>Target:</strong> ${targetName}</p>
               <p><strong>URL:</strong> <a href="${url}">${url}</a></p>
               <p>The monitoring service has detected that this site is unresponsive after 3 retries.</p>`
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Alert email sent for ${targetName}`);
    } catch (error) {
        console.error("Email Error:", error.message);
    }
};

// Helper function to retry pings with error categorization

const pingWithRetry = async (url, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        const start = Date.now();
        try {
            const response = await axios.get(url, { timeout: 5000 });
            return { 
                status: 'Up', 
                responseTime: Date.now() - start, 
                statusCode: response.status 
            };
        } catch (error) {
            if (i === retries - 1) {
                return { 
                    status: 'Down', 
                    responseTime: 0, 
                    statusCode: error.response ? error.response.status : null,
                    errorMessage: error.message 
                };
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            console.log(`⚠️ Retrying ${url} (${i + 1}/${retries})...`);
        }
    }
};

export const startMonitoring = () => {
    // Heartbeat check every minute
    cron.schedule('* * * * *', async () => {
        console.log('--- 🛡️ Vigil Heartbeat: Checking Targets 🛡️ ---');
        const targets = await Target.find({ isActive: true });

        if (targets.length === 0) {
            console.log('ℹ️ No active targets found to check.');
            return;
        }

        for (const target of targets) {
            const result = await pingWithRetry(target.url);
            
            // Send alert if the status is Down
            if (result.status === 'Down') {
                await sendAlertEmail(target.name, target.url);
            }

            await Monitor.create({
                url: target.url,
                status: result.status,
                responseTime: result.responseTime,
                statusCode: result.statusCode, 
                errorMessage: result.errorMessage 
            });

            if (result.status === 'Up') {
                console.log(`✅ ${target.name} is UP (${result.responseTime}ms)`);
            } else {
                console.log(`❌ ${target.name} is DOWN after 3 attempts`);
            }
        }
    });

    // Automated daily cleanup 
    cron.schedule('0 0 * * *', async () => {
        await autoCleanup();
    });
};