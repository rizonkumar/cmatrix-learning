import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    topics: [topicSchema],
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Subject Schema
const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    chapters: [chapterSchema],
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    classLevel: {
      type: String,
      required: true,
      enum: [
        "8th",
        "9th",
        "10th",
        "11th",
        "12th",
        "JEE Main",
        "JEE Advanced",
        "NEET",
      ],
    },
    subjects: [subjectSchema],
    isActive: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    version: {
      type: String,
      default: "1.0",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

syllabusSchema.index({ classLevel: 1, isActive: 1 });
syllabusSchema.index({ createdBy: 1 });

syllabusSchema.pre("save", async function (next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      {
        classLevel: this.classLevel,
        _id: { $ne: this._id },
      },
      { isActive: false }
    );
  }
  next();
});

syllabusSchema.statics.getActiveSyllabus = function (classLevel) {
  return this.findOne({ classLevel, isActive: true })
    .populate("createdBy", "username fullName email")
    .sort({ createdAt: -1 });
};

syllabusSchema.statics.getSyllabiByClassLevel = function (classLevel) {
  return this.find({ classLevel })
    .populate("createdBy", "username fullName email")
    .sort({ isActive: -1, createdAt: -1 });
};

export const Syllabus = mongoose.model("Syllabus", syllabusSchema);
