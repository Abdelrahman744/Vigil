import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    // 1. If password isn't modified, just return (Mongoose proceeds automatically)
    if (!this.isModified('password')) return;
    
    // 2. Hash the password
    this.password = await bcrypt.hash(this.password, 12);
    
    // NO next() call needed here because the function is async
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);