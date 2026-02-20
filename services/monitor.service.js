import cron from 'node-cron';
import axios from 'axios';
import Target from '../models/target.model.js';
import Monitor from '../models/monitor.model.js';

export const startMonitoring = () => {
    // This runs every minute
    cron.schedule('* * * * *', async () => {
        console.log('--- 🛡️ Vigil Heartbeat: Checking Targets ---');
        const targets = await Target.find({ isActive: true });

        for (const target of targets) {
            const start = Date.now();
            try {
                await axios.get(target.url, { timeout: 5000 });
                const responseTime = Date.now() - start;

                await Monitor.create({
                    url: target.url,
                    status: 'Up',
                    responseTime
                });
                console.log(`✅ ${target.name} is UP (${responseTime}ms)`);
            } catch (error) {
                await Monitor.create({
                    url: target.url,
                    status: 'Down',
                    responseTime: 0
                });
                console.log(`❌ ${target.name} is DOWN`);
            }
        }
    });
};