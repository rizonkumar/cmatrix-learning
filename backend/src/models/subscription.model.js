import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subscriptionType: {
      type: String,
      enum: ["monthly", "6-months", "yearly"],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "partial", "overdue"],
      default: "pending",
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      trim: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "bank-transfer", "cheque", "other"],
      default: "cash",
    },
    notes: {
      type: String,
      trim: true,
    },
    // Course and Class Information
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      index: true,
    },
    courseName: {
      type: String,
      trim: true,
      index: true,
    },
    classLevel: {
      type: String,
      enum: [
        "8th",
        "9th",
        "10th",
        "11th",
        "12th",
        "JEE Main",
        "JEE Advanced",
        "NEET",
        "Other",
      ],
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      index: true,
    },
    lastPaymentDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Admin who created/updated this subscription
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Tracking for admin
    paymentHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        paymentDate: {
          type: Date,
          default: Date.now,
        },
        paymentMethod: {
          type: String,
          enum: ["cash", "online", "bank-transfer", "cheque", "other"],
        },
        transactionId: {
          type: String,
          trim: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        notes: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
subscriptionSchema.index({ user: 1, subscriptionType: 1 });
subscriptionSchema.index({ paymentStatus: 1, endDate: 1 });
subscriptionSchema.index({ createdAt: -1 });

// Virtual for checking if subscription is active
subscriptionSchema.virtual("isActive").get(function () {
  return this.paymentStatus === "paid" && new Date() <= this.endDate;
});

// Virtual for calculating days remaining
subscriptionSchema.virtual("daysRemaining").get(function () {
  const today = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for calculating overdue days
subscriptionSchema.virtual("overdueDays").get(function () {
  if (this.paymentStatus === "paid" || new Date() <= this.endDate) {
    return 0;
  }
  const today = new Date();
  const endDate = new Date(this.endDate);
  const diffTime = today - endDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to calculate total paid amount
subscriptionSchema.methods.getTotalPaidAmount = function () {
  return this.paymentHistory.reduce(
    (total, payment) => total + payment.amount,
    0
  );
};

// Method to calculate remaining amount
subscriptionSchema.methods.getRemainingAmount = function () {
  return this.amount - this.getTotalPaidAmount();
};

// Static method to get subscriptions by user
subscriptionSchema.statics.getUserSubscriptions = function (userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to get overdue subscriptions
subscriptionSchema.statics.getOverdueSubscriptions = function () {
  return this.find({
    paymentStatus: { $in: ["pending", "partial", "overdue"] },
    endDate: { $lt: new Date() },
  });
};

// Static method to get active subscriptions
subscriptionSchema.statics.getActiveSubscriptions = function () {
  return this.find({
    paymentStatus: "paid",
    endDate: { $gte: new Date() },
  });
};

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
