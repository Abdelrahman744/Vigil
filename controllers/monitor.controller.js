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
        const { id } = req.params;
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
  const start = Date.now();

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const duration = Date.now() - start;

    const newPing = await Monitor.create({
      url,
      status: 'Up',
      responseTime: duration,
      statusCode: response.status //
    });

    res.status(200).json({ message: "Ping Successful", data: newPing });
  } catch (error) {
    const duration = Date.now() - start;
    const failPing = await Monitor.create({
      url,
      status: 'Down',
      responseTime: duration,
      statusCode: error.response ? error.response.status : null, //
      errorMessage: error.message //
    });

    res.status(500).json({ message: "Ping Failed", data: failPing });
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


// Toggle monitoring status 
export const toggleTarget = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await Target.findById(id);

        if (!target) {
            return res.status(404).json({ message: "Target not found" });
        }

        
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




// Get detailed stats for a specific target

export const getTargetStats = async (req, res) => {
    try {
        const { id } = req.params;
        const target = await Target.findById(id);

        if (!target) {
            return res.status(404).json({ message: "Target not found" });
        }

        const logs = await Monitor.find({ url: target.url });

        if (logs.length === 0) {
            return res.status(200).json({ message: "No logs found for this target yet.", stats: null });
        }

        const totalPings = logs.length;
        const upPings = logs.filter(log => log.status === 'Up').length;
        const availability = ((upPings / totalPings) * 100).toFixed(2);

        // Calculate Average Response Time for "Up" pings
        const upLogs = logs.filter(log => log.status === 'Up' && log.responseTime > 0);
        const avgResponseTime = upLogs.length > 0 
            ? (upLogs.reduce((acc, log) => acc + log.responseTime, 0) / upLogs.length).toFixed(2) 
            : 0;

        res.status(200).json({
            targetName: target.name,
            url: target.url,
            stats: {
                totalChecks: totalPings,
                upChecks: upPings,
                downChecks: totalPings - upPings,
                availability: `${availability}%`,
                averageLatency: `${avgResponseTime}ms`
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error calculating stats", error: error.message });
    }
};