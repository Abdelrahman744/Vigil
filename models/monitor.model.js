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
    type: Number,
    default: 0
  },
  statusCode: {
    type: Number 
  },
  errorMessage: { type: String },
  lastChecked: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

const Monitor = mongoose.model('Monitor', monitorSchema);

export default Monitor;