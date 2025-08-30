import React, { useState } from "react";
import { ThumbsUp, Flag, Star, Edit, Trash2, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Button from "../common/Button";
import useAuthStore from "../../store/authStore";
import reviewService from "../../services/reviewService";
import { toast } from "react-hot-toast";

const ReviewItem = ({
  review,
  onUpdate,
  onDelete,
  showCourseInfo = false,
  isMyReview = false,
}) => {
  const [isMarkingHelpful, setIsMarkingHelpful] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const { user } = useAuthStore();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`inline w-4 h-4 ${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const handleMarkHelpful = async () => {
    if (!user) {
      toast.error("Please login to mark review as helpful");
      return;
    }

    setIsMarkingHelpful(true);
    try {
      await reviewService.markReviewHelpful(review._id);
      toast.success("Review marked as helpful!");
      // Refresh the review data
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to mark review as helpful");
    } finally {
      setIsMarkingHelpful(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    setIsReporting(true);
    try {
      await reviewService.reportReview(review._id, { reason: reportReason });
      toast.success("Review reported successfully");
      setShowReportForm(false);
      setReportReason("");
    } catch (error) {
      toast.error(error.message || "Failed to report review");
    } finally {
      setIsReporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewService.deleteReview(review._id);
      toast.success("Review deleted successfully");
      if (onDelete) onDelete(review._id);
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  const isHelpfulMarked = review.helpful?.includes(user?.id);
  const isReported = review.reported?.includes(user?.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-4">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={review.student.avatar || "/default-avatar.png"}
            alt={review.student.fullName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {review.student.fullName}
              </h4>
              {review.isVerified && (
                <CheckCircle
                  className="w-4 h-4 text-green-500"
                  title="Verified Review"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isMyReview && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  /* TODO: Implement edit */
                }}
                className="p-2"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Course Info (if shown) */}
      {showCourseInfo && review.course && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Course: <span className="font-medium">{review.course.title}</span>
        </div>
      )}

      {/* Review Title */}
      <h5 className="font-medium text-lg mb-2 text-gray-900 dark:text-white">
        {review.title}
      </h5>

      {/* Review Comment */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {review.comment}
      </p>

      {/* Review Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {/* Helpful Button */}
          <button
            onClick={handleMarkHelpful}
            disabled={isMarkingHelpful || isHelpfulMarked}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              isHelpfulMarked
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 ${isHelpfulMarked ? "fill-current" : ""}`}
            />
            <span>Helpful ({review.helpfulCount || 0})</span>
          </button>

          {/* Report Button */}
          <button
            onClick={() => setShowReportForm(!showReportForm)}
            disabled={isReported}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
              isReported
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>{isReported ? "Reported" : "Report"}</span>
          </button>
        </div>

        {/* Review Status (for admin) */}
        {user?.role === "admin" && (
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                review.isApproved
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {review.isApproved ? "Approved" : "Pending"}
            </span>
          </div>
        )}
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleReport} className="space-y-3">
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain why you're reporting this review..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              rows="3"
              required
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isReporting}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {isReporting ? "Reporting..." : "Submit Report"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowReportForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;
