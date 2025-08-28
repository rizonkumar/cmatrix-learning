import mongoose from 'mongoose';

const kanbanCardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KanbanColumn',
        required: true
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'KanbanBoard',
        required: true
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    labels: [{
        type: String,
        trim: true
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Compound index for efficient queries
kanbanCardSchema.index({ columnId: 1, order: 1 });
kanbanCardSchema.index({ boardId: 1, createdAt: -1 });

export const KanbanCard = mongoose.model('KanbanCard', kanbanCardSchema);
