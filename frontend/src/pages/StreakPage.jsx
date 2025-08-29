import React, { useState, useEffect } from "react";
import {
  Flame,
  Star,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Trophy,
  Zap,
  Crown,
  Medal,
  CheckCircle,
  Clock,
  BarChart3,
  BookOpen,
  Heart,
  Gift,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Share,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import LearningStreaks from "../components/LearningStreaks";
import Button from "../components/common/Button";

const StreakPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStreak, setCurrentStreak] = useState(12);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Timer functionality
  useEffect(() => {
    let interval;
    if (isTimerActive && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          setIsTimerActive(false);
          setShowCelebration(true);
          setCurrentStreak(currentStreak + 1);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerMinutes, timerSeconds]);

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first day of learning",
      icon: Star,
      earned: true,
      earnedDate: "2024-01-10",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      rarity: "Common",
      points: 10,
      unlockedAt: "Day 1",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintain a 7-day learning streak",
      icon: Flame,
      earned: true,
      earnedDate: "2024-01-15",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      rarity: "Rare",
      points: 50,
      unlockedAt: "Day 7",
    },
    {
      id: 3,
      title: "Consistency King",
      description: "Complete 30 days of learning",
      icon: Target,
      earned: false,
      progress: 60,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      rarity: "Epic",
      points: 100,
      nextMilestone: 18,
    },
    {
      id: 4,
      title: "Master Learner",
      description: "Achieve a 50-day streak",
      icon: Award,
      earned: false,
      progress: 24,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      rarity: "Legendary",
      points: 200,
      nextMilestone: 38,
    },
    {
      id: 5,
      title: "Study Champion",
      description: "Complete 100 learning sessions",
      icon: Trophy,
      earned: false,
      progress: 35,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      rarity: "Mythic",
      points: 500,
      nextMilestone: 65,
    },
    {
      id: 6,
      title: "Speed Demon",
      description: "Complete 5 lessons in one day",
      icon: Zap,
      earned: false,
      progress: 80,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      rarity: "Rare",
      points: 75,
      nextMilestone: 4,
    },
    {
      id: 7,
      title: "Night Owl",
      description: "Study past midnight 10 times",
      icon: Medal,
      earned: false,
      progress: 45,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      rarity: "Epic",
      points: 150,
      nextMilestone: 5.5,
    },
    {
      id: 8,
      title: "Social Butterfly",
      description: "Share 25 achievements",
      icon: Share,
      earned: false,
      progress: 20,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      rarity: "Common",
      points: 25,
      nextMilestone: 5,
    },
  ];

  const weeklyProgress = [
    { day: "Mon", completed: true, hours: 2.5, lessons: 3, mood: "excellent" },
    { day: "Tue", completed: true, hours: 1.8, lessons: 2, mood: "good" },
    { day: "Wed", completed: true, hours: 3.2, lessons: 4, mood: "excellent" },
    {
      day: "Thu",
      completed: false,
      hours: 1.0,
      lessons: 1,
      inProgress: true,
      mood: "good",
    },
    { day: "Fri", completed: false, hours: 0, lessons: 0, mood: "neutral" },
    { day: "Sat", completed: false, hours: 0, lessons: 0, mood: "neutral" },
    { day: "Sun", completed: false, hours: 0, lessons: 0, mood: "neutral" },
  ];

  const streakMilestones = [
    {
      days: 3,
      title: "Getting Started",
      color: "bg-blue-500",
      unlocked: true,
      achieved: "2024-01-03",
    },
    {
      days: 7,
      title: "Week Champion",
      color: "bg-green-500",
      unlocked: true,
      achieved: "2024-01-07",
    },
    {
      days: 14,
      title: "Fortnight Hero",
      color: "bg-yellow-500",
      unlocked: false,
      next: 2,
    },
    {
      days: 30,
      title: "Monthly Master",
      color: "bg-orange-500",
      unlocked: false,
      next: 18,
    },
    {
      days: 50,
      title: "Golden Streak",
      color: "bg-red-500",
      unlocked: false,
      next: 38,
    },
    {
      days: 100,
      title: "Century Club",
      color: "bg-purple-500",
      unlocked: false,
      next: 88,
    },
  ];

  const stats = [
    {
      label: "Current Streak",
      value: currentStreak.toString(),
      unit: "days",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      change: "+2 from last week",
      trend: "up",
    },
    {
      label: "Total Study Time",
      value: "47.5",
      unit: "hours",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+8.5 this week",
      trend: "up",
    },
    {
      label: "Lessons Completed",
      value: "89",
      unit: "lessons",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: "+12 this week",
      trend: "up",
    },
    {
      label: "Achievements Earned",
      value: "2",
      unit: "badges",
      icon: Trophy,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "2 more to unlock",
      trend: "neutral",
    },
  ];

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "excellent":
        return "😄";
      case "good":
        return "😊";
      case "neutral":
        return "😐";
      case "tired":
        return "😴";
      default:
        return "😐";
    }
  };

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "text-gray-500";
      case "Rare":
        return "text-blue-500";
      case "Epic":
        return "text-purple-500";
      case "Legendary":
        return "text-orange-500";
      case "Mythic":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Amazing Work!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You completed a study session! Your streak has increased to{" "}
                {currentStreak} days!
              </p>
            </div>
            <Button
              onClick={() => setShowCelebration(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}

      {/* Header Section with Pomodoro Timer */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 dark:from-orange-600 dark:via-red-600 dark:to-pink-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                  <Flame className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold">
                    Learning Streaks & Achievements
                  </h1>
                  <p className="text-orange-100 text-base lg:text-lg">
                    Track your progress, celebrate milestones, and stay
                    motivated! 🔥
                  </p>
                </div>
              </div>

              {/* Pomodoro Timer */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-200" />
                    <span className="text-sm font-medium text-orange-100">
                      Pomodoro Timer
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {!isTimerActive ? (
                      <button
                        onClick={startTimer}
                        className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                      >
                        <PauseCircle className="w-4 h-4 text-white" />
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      className="p-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl lg:text-4xl font-mono font-bold mb-1 ${
                      isTimerActive
                        ? "text-green-300"
                        : timerMinutes === 0 && timerSeconds === 0
                        ? "text-blue-300"
                        : "text-white"
                    }`}
                  >
                    {formatTime(timerMinutes, timerSeconds)}
                  </div>
                  <div className="text-xs text-orange-200">
                    {isTimerActive
                      ? "Focus Time!"
                      : timerMinutes === 0 && timerSeconds === 0
                      ? "Session Complete!"
                      : "Ready to Start"}
                  </div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const TrendIcon =
                    stat.trend === "up"
                      ? ChevronUp
                      : stat.trend === "down"
                      ? ChevronDown
                      : null;
                  return (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="w-4 h-4 text-orange-200" />
                        {TrendIcon && (
                          <TrendIcon
                            className={`w-3 h-3 ${
                              stat.trend === "up"
                                ? "text-green-300"
                                : "text-red-300"
                            }`}
                          />
                        )}
                      </div>
                      <div className="text-xl lg:text-2xl font-bold mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-orange-200 mb-1">
                        {stat.unit}
                      </div>
                      <div
                        className={`text-xs ${
                          stat.trend === "up"
                            ? "text-green-300"
                            : stat.trend === "down"
                            ? "text-red-300"
                            : "text-orange-200"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Motivational Card */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <div>
                    <div className="font-semibold text-lg">Keep Going!</div>
                    <div className="text-sm text-orange-100">
                      You're on fire! 🔥
                    </div>
                  </div>
                </div>
                <div className="text-sm text-orange-100">
                  {currentStreak} days and counting! Your dedication is
                  inspiring.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
        <div className="flex space-x-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "achievements", label: "Achievements", icon: Trophy },
            { id: "progress", label: "Progress", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Streak Component */}
          <div className="xl:col-span-2">
            <LearningStreaks />
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  This Week's Progress
                </h3>
              </div>

              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          day.completed
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : day.inProgress
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {day.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          day.day.slice(0, 1)
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {day.day}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {day.completed
                            ? `${day.hours}h • ${day.lessons} lessons`
                            : day.inProgress
                            ? "In Progress"
                            : "Not started"}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        day.completed
                          ? "text-green-600"
                          : day.inProgress
                          ? "text-orange-600"
                          : "text-gray-400"
                      }`}
                    >
                      {day.completed ? "Done" : day.inProgress ? "Active" : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Milestones */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Streak Milestones
                </h3>
              </div>

              <div className="space-y-3">
                {streakMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${milestone.color} ${
                          milestone.unlocked
                            ? "ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600"
                            : ""
                        }`}
                      />
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            milestone.unlocked
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {milestone.days} days
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {milestone.title}
                        </div>
                      </div>
                    </div>
                    {milestone.unlocked && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-8">
          {/* Achievement Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                2
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Earned
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                4
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                In Progress
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Star className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                360
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Points
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
              <Crown className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                Silver
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current Rank
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    achievement.earned
                      ? `${achievement.borderColor} ${achievement.bgColor} shadow-lg`
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  {/* Rarity Badge */}
                  <div className="absolute -top-2 -right-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        achievement.earned
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {achievement.earned ? "Earned" : achievement.rarity}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Achievement Icon */}
                      <div
                        className={`p-4 rounded-xl flex-shrink-0 ${
                          achievement.earned
                            ? achievement.bgColor
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            achievement.earned
                              ? achievement.color
                              : "text-gray-400"
                          }`}
                        />
                      </div>

                      {/* Achievement Details */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-semibold mb-1 ${
                            achievement.earned
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm mb-3 ${
                            achievement.earned
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-500 dark:text-gray-500"
                          }`}
                        >
                          {achievement.description}
                        </p>

                        {/* Points */}
                        <div className="flex items-center space-x-1 mb-3">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {achievement.points} points
                          </span>
                        </div>

                        {/* Earned Date */}
                        {achievement.earned && achievement.earnedDate && (
                          <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span>
                              Earned on{" "}
                              {new Date(
                                achievement.earnedDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Progress Bar */}
                        {!achievement.earned && achievement.progress && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${achievement.color.replace(
                                  "text-",
                                  "bg-"
                                )}`}
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "progress" && (
        <div className="space-y-8">
          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl border border-gray-200 dark:border-gray-700 ${stat.bgColor}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.change}
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      {stat.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational CTA */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-6 h-6 text-pink-300" />
              <h3 className="text-2xl font-bold">
                Keep Your Learning Streak Alive!
              </h3>
              <Heart className="w-6 h-6 text-pink-300" />
            </div>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Every day you learn is a step towards your goals. Small consistent
              efforts lead to big results. Stay motivated and keep the streak
              going! 🔥
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3">
                <Calendar className="w-5 h-5 mr-2" />
                Plan Today's Study
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-6 py-3"
              >
                <Target className="w-5 h-5 mr-2" />
                Set New Goals
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-6 py-3"
              >
                <Gift className="w-5 h-5 mr-2" />
                View Rewards
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl max-w-md mx-4">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Amazing Work!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You completed a study session! Your streak has increased to{" "}
                {currentStreak} days!
              </p>
            </div>
            <Button
              onClick={() => setShowCelebration(false)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Achievement Details
              </h2>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-center mb-6">
              <div
                className={`p-6 rounded-2xl inline-block ${selectedAchievement.bgColor}`}
              >
                <selectedAchievement.icon
                  className={`w-12 h-12 ${selectedAchievement.color}`}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
                {selectedAchievement.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedAchievement.description}
              </p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  selectedAchievement.earned
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {selectedAchievement.earned
                  ? "Earned"
                  : selectedAchievement.rarity}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Points</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedAchievement.points}
                </span>
              </div>

              {selectedAchievement.earned && selectedAchievement.earnedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Earned On
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(
                      selectedAchievement.earnedDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}

              {selectedAchievement.unlockedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Unlocked At
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedAchievement.unlockedAt}
                  </span>
                </div>
              )}

              {!selectedAchievement.earned &&
                selectedAchievement.progress !== undefined && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {selectedAchievement.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${selectedAchievement.color.replace(
                          "text-",
                          "bg-"
                        )}`}
                        style={{ width: `${selectedAchievement.progress}%` }}
                      />
                    </div>
                    {selectedAchievement.nextMilestone && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {selectedAchievement.nextMilestone} more to unlock
                      </p>
                    )}
                  </div>
                )}
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                onClick={() => setSelectedAchievement(null)}
                className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Close
              </Button>
              {!selectedAchievement.earned && (
                <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                  <Share className="w-4 h-4 mr-2" />
                  Share Progress
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakPage;
