import mongoose from 'mongoose';

const monitorSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "You must provide a URL to monitor"],
    trim: true
  },
  status: {
    type: String,
    enum: ['Up', 'Down', 'Pending'],
    default: 'Pending'
  },
  responseTime: {
    type: Number, // This stores the milliseconds (ms)
    default: 0
  },
  statusCode: {
    type: Number // e.g., 200, 404, 500
  },
  lastChecked: {
    type: Date,
    default: Date.now
  }
}, { 
  // This automatically adds 'createdAt' and 'updatedAt' fields
  timestamps: true 
});

const Monitor = mongoose.model('Monitor', monitorSchema);

export default Monitor;