import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Edit, Trash2, ExternalLink } from "lucide-react";
import Button from "../components/common/Button";
import ReviewItem from "../components/reviews/ReviewItem";
import Modal from "../components/common/Modal";
import ReviewForm from "../components/reviews/ReviewForm";
import reviewService from "../services/reviewService";
import { toast } from "react-hot-toast";

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    reviewsThisMonth: 0,
  });

  useEffect(() => {
    loadReviews(true);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          : 0;

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const reviewsThisMonth = reviews.filter(
        (review) => new Date(review.createdAt) >= thisMonth
      ).length;

      setStats({
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        reviewsThisMonth,
      });
    } catch (error) {
      console.error("Failed to calculate stats:", error);
    }
  };

  const loadReviews = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    }

    try {
      const currentPage = reset ? 1 : page;
      const response = await reviewService.getMyReviews({
        page: currentPage,
        limit: 10,
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
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      toast.success("Review deleted successfully!");
      loadReviews(true);
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  const renderStars = (rating, size = "text-yellow-400") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`inline w-4 h-4 ${
            i <= rating ? `${size} fill-current` : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                >
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Reviews
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your course reviews and ratings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Reviews
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalReviews}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Rating
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    {renderStars(
                      Math.round(stats.averageRating),
                      "text-yellow-400"
                    )}
                  </div>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.reviewsThisMonth}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">
                  {new Date().toLocaleString("default", { month: "short" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't written any reviews yet. Start by enrolling in a
              course and sharing your experience!
            </p>
            <Button
              onClick={() => (window.location.href = "/courses")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {review.course.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {review.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {review.course.category}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() =>
                        (window.location.href = `/courses/${review.course._id}`)
                      }
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Course
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <ReviewItem
                    review={review}
                    isMyReview={true}
                    showCourseInfo={false}
                    onUpdate={() => loadReviews(true)}
                    onDelete={handleDeleteReview}
                  />

                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      onClick={() => setEditingReview(review)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Review
                    </Button>
                    <Button
                      onClick={() => handleDeleteReview(review._id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center py-6">
                <Button
                  onClick={() => loadReviews(false)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Load More Reviews
                </Button>
              </div>
            )}
          </div>
        )}

        {editingReview && (
          <Modal onClose={() => setEditingReview(null)}>
            <ReviewForm
              courseId={editingReview.course._id}
              onClose={() => setEditingReview(null)}
              onSuccess={() => {
                setEditingReview(null);
                loadReviews(true);
              }}
              initialData={editingReview}
              isEditing={true}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MyReviewsPage;
