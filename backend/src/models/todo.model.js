import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    taskDescription: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries by owner
todoSchema.index({ owner: 1, createdAt: -1 });

export const Todo = mongoose.model('Todo', todoSchema);
