import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Flame, TrendingUp, Award, Target, Zap } from "lucide-react";
import { userService } from "../services/userService";
import { DataLoader } from "./common/LoadingSpinner";
import { StatsCardSkeleton } from "./common/SkeletonLoader";

const LearningStreaks = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streakDays, setStreakDays] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserStats();
      setUserStats(response.data.stats);
    } catch (err) {
      setError("Failed to load learning stats");
      console.error("Error loading user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueStreak = async () => {
    try {
      setButtonLoading(true);
      await userService.updateStreak({});

      // Reload stats to get updated streak data
      await loadUserStats();

      toast.success("Streak updated! Keep up the great work! 🔥");

      // Navigate to courses page to encourage learning
      setTimeout(() => {
        navigate("/my-courses");
      }, 1500);
    } catch (err) {
      console.error("Error updating streak:", err);
      toast.error("Failed to update streak. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  useEffect(() => {
    if (userStats) {
      // Generate streak visualization
      const days = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const isCompleted = i <= (userStats.currentStreak || 0) - 1;
        const isToday = i === 0;

        days.push({
          date,
          day: date.getDate(),
          isCompleted,
          isToday,
        });
      }

      setStreakDays(days);
    }
  }, [userStats]);

  const getStreakMessage = (streak) => {
    if (streak === 0) {
      return {
        message: "Start your learning journey today!",
        encouragement: "Every expert was once a beginner.",
        icon: Zap,
      };
    } else if (streak < 3) {
      return {
        message: "Great start! Keep it going!",
        encouragement: "Consistency is key to success.",
        icon: TrendingUp,
      };
    } else if (streak < 7) {
      return {
        message: "You're on fire! 🔥",
        encouragement: "Building great habits takes time.",
        icon: Flame,
      };
    } else if (streak < 14) {
      return {
        message: "Amazing consistency!",
        encouragement: "You're becoming unstoppable.",
        icon: Target,
      };
    } else {
      return {
        message: "Legendary streak! 🏆",
        encouragement: "You're a learning champion!",
        icon: Award,
      };
    }
  };

  const getStreakColor = (streak) => {
    if (streak === 0) return "text-gray-500";
    if (streak < 3) return "text-blue-500";
    if (streak < 7) return "text-orange-500";
    if (streak < 14) return "text-red-500";
    return "text-purple-500";
  };

  const getStreakBgColor = (streak) => {
    if (streak === 0) return "bg-gray-100 dark:bg-gray-800";
    if (streak < 3) return "bg-blue-100 dark:bg-blue-900/20";
    if (streak < 7) return "bg-orange-100 dark:bg-orange-900/20";
    if (streak < 14) return "bg-red-100 dark:bg-red-900/20";
    return "bg-purple-100 dark:bg-purple-900/20";
  };

  const currentStreak = userStats?.currentStreak || 0;
  const longestStreak = userStats?.longestStreak || 0;
  const streakInfo = getStreakMessage(currentStreak);
  const StreakIcon = streakInfo.icon;

  const getDayStatus = (day) => {
    if (day.isToday && !day.isCompleted)
      return "bg-gray-200 dark:bg-gray-700 text-gray-500";
    if (day.isCompleted)
      return `${getStreakColor().replace("text-", "bg-")} text-white`;
    return "bg-gray-100 dark:bg-gray-800 text-gray-400";
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <StatsCardSkeleton count={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <DataLoader
          loading={false}
          error={error}
          onRetry={loadUserStats}
          emptyMessage="No streak data available"
        >
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Unable to load streak data
            </p>
          </div>
        </DataLoader>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div
            className={`${getStreakBgColor(currentStreak)} p-3 rounded-full`}
          >
            <Flame className={`w-6 h-6 ${getStreakColor(currentStreak)}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Learning Streak
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep your momentum going!
            </p>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`text-3xl font-bold ${getStreakColor(currentStreak)}`}
          >
            {currentStreak}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            days streak
          </div>
        </div>
      </div>

      {/* Streak Visualization */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-white">
            This Week
          </span>
          <div className="flex items-center space-x-1">
            <StreakIcon className={`w-4 h-4 ${getStreakColor()}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {streakInfo.message}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {streakDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${getDayStatus(
                day
              )} ${day.isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
            >
              {day.day}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-3 space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Motivation Message */}
      <div className={`${getStreakBgColor(currentStreak)} rounded-lg p-4 mb-6`}>
        <div className="flex items-start space-x-3">
          <StreakIcon
            className={`w-5 h-5 ${getStreakColor(currentStreak)} mt-0.5`}
          />
          <div>
            <p className={`font-medium ${getStreakColor(currentStreak)}`}>
              {streakInfo.message}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {streakInfo.encouragement}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {longestStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Longest Streak
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {userStats?.totalLearningHours || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Hours This Week
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={handleContinueStreak}
          disabled={buttonLoading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            currentStreak === 0
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          }`}
        >
          {buttonLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Updating...</span>
            </div>
          ) : currentStreak === 0 ? (
            "Start Learning Today"
          ) : (
            "Continue Your Streak"
          )}
        </button>
      </div>
    </div>
  );
};

export default LearningStreaks;
