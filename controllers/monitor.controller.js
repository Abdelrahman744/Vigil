import axios from 'axios';
import Monitor from '../models/monitor.model.js';

export const pingWebsite = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "Please provide a URL" });
  }

  // Start the timer
  const start = Date.now();

  try {
    // We use a 5-second timeout so we don't wait forever
    const response = await axios.get(url, { timeout: 5000 });
    
    // Calculate how many milliseconds it took
    const duration = Date.now() - start;

    // Save the success result to MongoDB
    const newPing = await Monitor.create({
      url,
      status: 'Up',
      responseTime: duration
    });

    res.status(200).json({
      message: "Ping Successful",
      data: newPing
    });

  } catch (error) {
    const duration = Date.now() - start;

    // Save the failure result to MongoDB
    const failPing = await Monitor.create({
      url,
      status: 'Down',
      responseTime: duration
    });

    res.status(500).json({
      message: "Ping Failed",
      error: error.message,
      data: failPing
    });
  }
};


// Get all ping history
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Monitor.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: logs.length,
      logs
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logs", error: error.message });
  }
};