import React, { useState, useEffect } from "react";
import { Plus, SortAsc, SortDesc, MessageSquare } from "lucide-react";
import Button from "../common/Button";
import ReviewStats from "./ReviewStats";
import ReviewItem from "./ReviewItem";
import ReviewForm from "./ReviewForm";
import Modal from "../common/Modal";
import reviewService from "../../services/reviewService";
import useAuthStore from "../../store/authStore";
import { toast } from "react-hot-toast";

const CourseReviews = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadReviews(true);
    loadStats();
  }, [courseId, sortBy]);

  const loadStats = async () => {
    try {
      const response = await reviewService.getReviewStats(courseId);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Failed to load review stats:", error);
    }
  };

  const loadReviews = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const currentPage = reset ? 1 : page;
      const response = await reviewService.getCourseReviews(courseId, {
        page: currentPage,
        limit: 10,
        sortBy,
      });

      if (reset) {
        setReviews(response.data.reviews);
      } else {
        setReviews((prev) => [...prev, ...response.data.reviews]);
      }

      setHasMore(response.data.pagination.hasNext);
      if (!reset) setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleReviewSuccess = () => {
    loadReviews(true);
    loadStats();
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // loadReviews will be called by useEffect
  };

  const getSortLabel = () => {
    const labels = {
      newest: "Newest First",
      oldest: "Oldest First",
      highest: "Highest Rated",
      lowest: "Lowest Rated",
      helpful: "Most Helpful",
    };
    return labels[sortBy] || "Newest First";
  };

  const canReview = () => {
    console.log("📝 [REVIEW] Checking if user can review...");
    console.log("🔐 [REVIEW] Is authenticated:", isAuthenticated);
    console.log("👤 [REVIEW] User:", user);
    console.log("📚 [REVIEW] Course ID:", courseId);
    console.log("📋 [REVIEW] Reviews count:", reviews.length);

    if (!isAuthenticated || !user) {
      console.log("❌ [REVIEW] User not authenticated or user object missing");
      return false;
    }

    // Check if user has already reviewed this course
    const hasReviewed = reviews.some(
      (review) => review.student._id === user._id
    );
    console.log("🔍 [REVIEW] Has user already reviewed:", hasReviewed);
    console.log("✅ [REVIEW] Can review:", !hasReviewed);

    return !hasReviewed;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reviews & Ratings
          </h2>
          {stats && (
            <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {stats.totalReviews} reviews
            </span>
          )}
        </div>

        {/* Write Review Button */}
        {canReview() && (
          <Button
            onClick={() => {
              console.log("✍️ [REVIEW] Write Review button clicked");
              console.log("📝 [REVIEW] Setting showReviewForm to true");
              setShowReviewForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Write Review
          </Button>
        )}
      </div>

      {/* Review Statistics */}
      <ReviewStats stats={stats} />

      {/* Filters and Sort */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
            {sortBy.includes("newest") || sortBy.includes("oldest") ? (
              <SortDesc className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            ) : (
              <SortAsc className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Sorted by: {getSortLabel()}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Be the first to share your experience with this course!
          </p>
          {canReview() && (
            <Button
              onClick={() => {
                console.log(
                  "🎯 [REVIEW] Write the First Review button clicked"
                );
                console.log(
                  "📝 [REVIEW] Setting showReviewForm to true for first review"
                );
                setShowReviewForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Write the First Review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              onUpdate={handleReviewSuccess}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center py-6">
              <Button
                onClick={() => loadReviews(false)}
                disabled={isLoadingMore}
                variant="outline"
                className="px-6 py-3"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading more reviews...
                  </div>
                ) : (
                  "Load More Reviews"
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <Modal onClose={() => setShowReviewForm(false)}>
          <ReviewForm
            courseId={courseId}
            onClose={() => setShowReviewForm(false)}
            onSuccess={handleReviewSuccess}
          />
        </Modal>
      )}
    </div>
  );
};

export default CourseReviews;
