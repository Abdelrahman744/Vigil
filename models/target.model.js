import mongoose from 'mongoose';

const targetSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // e.g., "My Portfolio"
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Target', targetSchema);