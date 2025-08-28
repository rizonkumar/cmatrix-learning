import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    },
    progress: {
        type: Number, // percentage (0-100)
        default: 0
    },
    completedLessons: [{
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    currentLesson: {
        moduleId: {
            type: mongoose.Schema.Types.ObjectId
        },
        lessonId: {
            type: mongoose.Schema.Types.ObjectId
        }
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    certificateUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Compound index to ensure a student can only enroll in a course once
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
