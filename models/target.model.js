import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
    url: { type: String, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    } 
}, { timestamps: true });

targetSchema.index({ url: 1, user: 1 }, { unique: true });

export default mongoose.model('Target', targetSchema);