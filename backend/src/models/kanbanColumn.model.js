import mongoose from "mongoose";

const kanbanColumnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KanbanBoard",
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
      default: "#6B7280", // Default gray color
    },
    wipLimit: {
      type: Number, // Work in Progress limit
      default: null,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KanbanCard",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
kanbanColumnSchema.index({ boardId: 1, order: 1 });

export const KanbanColumn = mongoose.model("KanbanColumn", kanbanColumnSchema);
