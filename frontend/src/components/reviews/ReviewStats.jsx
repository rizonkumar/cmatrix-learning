import React from "react";
import { Star } from "lucide-react";

const ReviewStats = ({ stats }) => {
  if (!stats) return null;

  const renderStars = (rating, size = "text-sm") => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`inline ${size} ${
            i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const getPercentage = (count) => {
    if (stats.totalReviews === 0) return 0;
    return Math.round((count / stats.totalReviews) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-6">
      {/* Overall Rating */}
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-yellow-400 mb-1">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(stats.averageRating), "text-lg")}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stats.totalReviews} reviews
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm w-6">{star}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${getPercentage(stats.ratingDistribution[star])}%`,
                  }}
                />
              </div>
              <span className="text-sm w-8 text-right">
                {stats.ratingDistribution[star]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {stats.verifiedReviews || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Verified Reviews
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {stats.totalReviews - (stats.verifiedReviews || 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Student Reviews
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">
            {stats.averageRating >= 4
              ? "Excellent"
              : stats.averageRating >= 3
              ? "Good"
              : stats.averageRating >= 2
              ? "Average"
              : "Poor"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Overall Rating
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
