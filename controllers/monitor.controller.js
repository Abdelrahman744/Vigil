import axios from 'axios';
import Monitor from '../models/monitor.model.js';
import Target from '../models/target.model.js';

export const addTarget = async (req, res) => {
    try {
        const { url, name } = req.body;
        
        // 1. Create the target
        const newTarget = await Target.create({ url, name, user: req.user._id });

        // 2. Perform an immediate initial ping so it doesn't show up as "Unknown"
        const start = Date.now();
        try {
            const response = await axios.get(url, { timeout: 5000 });
            await Monitor.create({
                target: newTarget._id,
                url: url,
                status: 'Up',
                responseTime: Date.now() - start,
                statusCode: response.status
            });
        } catch (error) {
            await Monitor.create({
                target: newTarget._id,
                url: url,
                status: 'Down',
                responseTime: Date.now() - start,
                statusCode: error.response ? error.response.status : null,
                errorMessage: error.message
            });
        }

        res.status(201).json(newTarget);
    } catch (error) {
        res.status(500).json({ message: "Error adding target", error: error.message });
    }
};



export const getTargets = async (req, res) => {
  try {
    // 1. Fetch targets using .lean() so we can easily add new properties to the results
    const targets = await Target.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();

    // 2. Fetch logs and calculate stats for each target
    const targetsWithStats = await Promise.all(targets.map(async (target) => {
        // Get logs for this specific target, sorted by newest first
        const logs = await Monitor.find({ target: target._id }).sort({ createdAt: -1 });
        
        let stats = null;
        let currentStatus = 'Unknown';

        if (logs.length > 0) {
            currentStatus = logs[0].status; // The most recent ping status

            const totalPings = logs.length;
            const upPings = logs.filter(log => log.status === 'Up').length;
            const availability = ((upPings / totalPings) * 100).toFixed(2);

            // Calculate Average Response Time for "Up" pings
            const upLogs = logs.filter(log => log.status === 'Up' && log.responseTime > 0);
            const avgResponseTime = upLogs.length > 0 
                ? (upLogs.reduce((acc, log) => acc + log.responseTime, 0) / upLogs.length).toFixed(2) 
                : 0;

            stats = {
                totalChecks: totalPings,
                upChecks: upPings,
                downChecks: totalPings - upPings,
                availability: `${availability}%`,
                averageLatency: `${avgResponseTime}ms`
            };
        }

        // Return the target combined with its new stats
        return {
            ...target,
            currentStatus,
            stats
        };
    }));

    res.status(200).json({
      count: targetsWithStats.length,
      targets: targetsWithStats
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching targets", error: error.message });
  }
};


// Delete a specific target by ID

export const deleteTarget = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the target being deleted belongs to the user
        const deletedTarget = await Target.findOneAndDelete({ _id: id, user: req.user._id });

        if (!deletedTarget) {
            return res.status(404).json({ message: "Target not found or unauthorized" });
        }
        await Monitor.deleteMany({ target: id });

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
    // 1. Find the URLs this user monitors
    const userTargets = await Target.find({ user: req.user._id }).select('_id');
    const targetIds = userTargets.map(t => t._id);



    // 2. Fetch logs only for those URLs
    const logs = await Monitor.find({ target: { $in: targetIds } }).sort({ createdAt: -1 });
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
    // 1. Find the URLs this user monitors
    const userTargets = await Target.find({ user: req.user._id }).select('_id');
    const targetIds = userTargets.map(t => t._id);

    // 2. Delete ONLY the logs associated with this user's targets
    await Monitor.deleteMany({ target: { $in: targetIds } });
    
    res.status(200).json({ message: "Your logs cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing logs", error: error.message });
  }
};


export const toggleTarget = async (req, res) => {
    try {
        const { id } = req.params;
        // Ensure the target being toggled belongs to the user
        const target = await Target.findOne({ _id: id, user: req.user._id });

        if (!target) {
            return res.status(404).json({ message: "Target not found or unauthorized" });
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
        const target = await Target.findOne({ _id: id, user: req.user._id });

        if (!target) return res.status(404).json({ message: "Target not found" });

        // FIX: Search by target ID, not URL string
        const logs = await Monitor.find({ target: target._id });

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




export const deleteAllTargets = async (req, res) => {
    try {
        // 1. Find all targets belonging to the user
        const userTargets = await Target.find({ user: req.user._id }).select('_id');
        const targetIds = userTargets.map(t => t._id);

        if (targetIds.length === 0) {
            return res.status(404).json({ message: "No targets found to delete." });
        }

        // 2. Delete all ping logs associated with these targets
        await Monitor.deleteMany({ target: { $in: targetIds } });

        // 3. Delete the targets themselves
        const result = await Target.deleteMany({ user: req.user._id });

        res.status(200).json({ 
            message: "All targets and their associated logs deleted successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting targets", error: error.message });
    }
};