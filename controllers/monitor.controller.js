import axios from 'axios';
import Monitor from '../models/monitor.model.js';

import Target from '../models/target.model.js';

export const addTarget = async (req, res) => {
    try {
        const { url, name } = req.body;
        const newTarget = await Target.create({ url, name });
        res.status(201).json(newTarget);
    } catch (error) {
        res.status(500).json({ message: "Error adding target", error: error.message });
    }
};

export const getTargets = async (req, res) => {
  try {
    const targets = await Target.find().sort({ createdAt: -1 });
    res.status(200).json({
      count: targets.length,
      targets
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching targets", error: error.message });
  }
};

// Delete a specific target by ID
export const deleteTarget = async (req, res) => {
    try {
        const { id } = req.params; // Gets the ID from the URL
        const deletedTarget = await Target.findByIdAndDelete(id);

        if (!deletedTarget) {
            return res.status(404).json({ message: "Target not found" });
        }

        res.status(200).json({ message: "Target deleted successfully", deletedTarget });
    } catch (error) {
        res.status(500).json({ message: "Error deleting target", error: error.message });
    }
};


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



export const clearLogs = async (req, res) => {
  try {
    await Monitor.deleteMany({});
    res.status(200).json({ message: "All logs cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing logs", error: error.message });
  }
};


// Toggle monitoring status (Pause/Resume)
export const toggleTarget = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await Target.findById(id);

        if (!target) {
            return res.status(404).json({ message: "Target not found" });
        }

        // Flip the status: if true becomes false, if false becomes true
        target.isActive = !target.isActive;
        await target.save();

        res.status(200).json({ 
            message: `Monitoring ${target.isActive ? 'resumed' : 'paused'} for ${target.name}`, 
            target 
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling status", error: error.message });
    }
};



// Remove logs older than 24 hours
export const autoCleanup = async () => {
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await Monitor.deleteMany({
            createdAt: { $lt: twentyFourHoursAgo }
        });
        if (result.deletedCount > 0) {
            console.log(`🧹 Cleanup: Removed ${result.deletedCount} old logs.`);
        }
    } catch (error) {
        console.error("Cleanup Error:", error.message);
    }
};