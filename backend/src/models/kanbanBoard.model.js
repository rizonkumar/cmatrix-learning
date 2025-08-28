import mongoose from 'mongoose';

const kanbanBoardSchema = new mongoose.Schema({
    boardName: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    color: {
        type: String,
        default: '#3B82F6' // Default blue color
    }
}, {
    timestamps: true
});

// Index for efficient queries by owner
kanbanBoardSchema.index({ owner: 1, createdAt: -1 });

export const KanbanBoard = mongoose.model('KanbanBoard', kanbanBoardSchema);
