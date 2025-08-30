import React, { useState, useEffect } from "react";
import { Shield, Check, X, Filter, Search, Eye } from "lucide-react";
import Button from "../components/common/Button";
import ReviewItem from "../components/reviews/ReviewItem";
import reviewService from "../services/reviewService";
import { toast } from "react-hot-toast";

const ReviewManagementPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    isApproved: "",
    courseId: "",
    rating: "",
    search: "",
  });
  const [stats, setStats] = useState({
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    reportedReviews: 0,
  });

  useEffect(() => {
    loadReviews(true);
    loadStats();
  }, [filters]);

  const loadStats = async () => {
    try {
      const response = await reviewService.getAllReviews();
      const allReviews = response.data.reviews;

      const totalReviews = allReviews.length;
      const approvedReviews = allReviews.filter((r) => r.isApproved).length;
      const pendingReviews = totalReviews - approvedReviews;
      const reportedReviews = allReviews.filter(
        (r) => r.reported && r.reported.length > 0
      ).length;

      setStats({
        totalReviews,
        approvedReviews,
        pendingReviews,
        reportedReviews,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadReviews = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
    }

    try {
      const currentPage = reset ? 1 : page;
      const queryParams = {
        page: currentPage,
        limit: 20,
        ...filters,
      };

      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === "") {
          delete queryParams[key];
        }
      });

      const response = await reviewService.getAllReviews(queryParams);

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
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await reviewService.approveReview(reviewId);
      toast.success("Review approved successfully!");
      loadReviews(true);
      loadStats();
    } catch (error) {
      toast.error(error.message || "Failed to approve review");
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await reviewService.rejectReview(reviewId);
      toast.success("Review rejected successfully!");
      loadReviews(true);
      loadStats();
    } catch (error) {
      toast.error(error.message || "Failed to reject review");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      isApproved: "",
      courseId: "",
      rating: "",
      search: "",
    });
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
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
              {Array.from({ length: 5 }).map((_, i) => (
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
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Review Management
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Moderate and manage course reviews and ratings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Approved
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.approvedReviews}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pendingReviews}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reported
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.reportedReviews}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">⚠️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.isApproved}
                onChange={(e) =>
                  handleFilterChange("isApproved", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Reviews</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange("rating", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {Object.values(filters).some((v) => v !== "")
                ? "Try adjusting your filters"
                : "No reviews to moderate at this time"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                {/* Review Header with Actions */}
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
                          {review.course.category} • {review.student.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-3">
                      {!review.isApproved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveReview(review._id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleRejectReview(review._id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 px-3 py-1"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      <div
                        className={`px-3 py-1 rounded-full text-sm ${
                          review.isApproved
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {review.isApproved ? "Approved" : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-6">
                  <ReviewItem
                    review={review}
                    showCourseInfo={false}
                    onUpdate={() => loadReviews(true)}
                  />
                </div>
              </div>
            ))}

            {/* Load More Button */}
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
      </div>
    </div>
  );
};

export default ReviewManagementPage;
