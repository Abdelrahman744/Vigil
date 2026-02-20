import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Target', targetSchema);