import mongoose from 'mongoose';

// Lesson Schema
const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String, // Could be video URL, PDF URL, or text content
        required: true
    },
    contentType: {
        type: String,
        enum: ['video', 'pdf', 'text', 'quiz'],
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    order: {
        type: Number,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Module Schema
const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    lessons: [lessonSchema],
    order: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Course Schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Class 10', 'Class 11', 'Class 12', 'IIT-JEE', 'NEET', 'Physics', 'Chemistry', 'Mathematics', 'Biology']
    },
    thumbnail: {
        type: String, // cloudinary url
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    modules: [moduleSchema],
    totalDuration: {
        type: Number, // in minutes
        default: 0
    },
    totalLessons: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total duration and lessons before saving
courseSchema.pre('save', function(next) {
    let totalDuration = 0;
    let totalLessons = 0;

    this.modules.forEach(module => {
        module.lessons.forEach(lesson => {
            totalDuration += lesson.duration;
            totalLessons += 1;
        });
    });

    this.totalDuration = totalDuration;
    this.totalLessons = totalLessons;
    next();
});

export const Course = mongoose.model('Course', courseSchema);
