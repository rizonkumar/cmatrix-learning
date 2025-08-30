import React, { useState } from "react";
import { X } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import reviewService from "../../services/reviewService";
import { toast } from "react-hot-toast";

const ReviewForm = ({
  courseId,
  onClose,
  onSuccess,
  initialData = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 5,
    title: initialData?.title || "",
    comment: initialData?.comment || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Review title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Review comment is required";
    } else if (formData.comment.length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    } else if (formData.comment.length > 500) {
      newErrors.comment = "Comment must be less than 500 characters";
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditing) {
        await reviewService.updateReview(initialData._id, formData);
        toast.success("Review updated successfully!");
      } else {
        await reviewService.createReview(courseId, formData);
        toast.success("Review submitted successfully!");
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingChange(i + 1)}
        className={`text-2xl transition-colors ${
          i < formData.rating
            ? "text-yellow-400 hover:text-yellow-500"
            : "text-gray-300 hover:text-yellow-400"
        }`}
      >
        ★
      </button>
    ));
  };

  const getRatingLabel = () => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return labels[formData.rating] || "";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Edit Review" : "Write a Review"}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Rating *
          </label>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">{renderStars()}</div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getRatingLabel()}
            </span>
          </div>
          {errors.rating && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.rating}
            </p>
          )}
        </div>

        {/* Title Input */}
        <div>
          <Input
            label="Review Title *"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Sum up your experience in a few words"
            error={errors.title}
            maxLength={100}
            required
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.title.length}/100 characters
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Review *
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share your experience with this course. What did you like? What could be improved?"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
              errors.comment ? "border-red-500" : "border-gray-300"
            }`}
            rows="6"
            maxLength={500}
            required
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.comment.length}/500 characters
          </div>
          {errors.comment && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.comment}
            </p>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Review Guidelines
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Focus on your learning experience and course content</li>
            <li>
              • Be specific about what you found helpful or could be improved
            </li>
            <li>• Keep your review constructive and respectful</li>
            <li>• Avoid sharing personal information</li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? "Updating..." : "Submitting..."}
              </div>
            ) : isEditing ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
