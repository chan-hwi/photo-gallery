import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Tag', TagSchema);