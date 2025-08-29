import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpful: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reported: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per student per course
reviewSchema.index({ course: 1, student: 1 }, { unique: true });

// Virtual for helpful count
reviewSchema.virtual("helpfulCount").get(function () {
  return this.helpful.length;
});

// Virtual for reported count
reviewSchema.virtual("reportedCount").get(function () {
  return this.reported.length;
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = function (userId) {
  if (!this.helpful.includes(userId)) {
    this.helpful.push(userId);
    return this.save();
  }
  return this;
};

// Method to report review
reviewSchema.methods.reportReview = function (userId) {
  if (!this.reported.includes(userId)) {
    this.reported.push(userId);
    return this.save();
  }
  return this;
};

// Static method to calculate average rating for a course
reviewSchema.statics.getAverageRating = async function (courseId) {
  const result = await this.aggregate([
    { $match: { course: courseId, isApproved: true } },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (result.length > 0) {
    const ratingCounts = {};
    for (let i = 1; i <= 5; i++) {
      ratingCounts[i] = result[0].ratingDistribution.filter(
        (rating) => rating === i
      ).length;
    }

    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
      ratingDistribution: ratingCounts,
    };
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
};

export const Review = mongoose.model("Review", reviewSchema);
