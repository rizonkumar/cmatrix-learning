import React from "react";
import { Flame, Award, TrendingUp, Calendar, Target, Star } from "lucide-react";
import LearningStreaks from "../components/LearningStreaks";
import Button from "../components/common/Button";

const StreakPage = () => {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first day of learning",
      icon: Star,
      earned: true,
      earnedDate: "2024-01-10",
      color: "text-yellow-500",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintain a 7-day learning streak",
      icon: Flame,
      earned: true,
      earnedDate: "2024-01-15",
      color: "text-orange-500",
    },
    {
      id: 3,
      title: "Consistency King",
      description: "Complete 30 days of learning",
      icon: Target,
      earned: false,
      progress: 60,
      color: "text-blue-500",
    },
    {
      id: 4,
      title: "Master Learner",
      description: "Achieve a 50-day streak",
      icon: Award,
      earned: false,
      progress: 20,
      color: "text-purple-500",
    },
    {
      id: 5,
      title: "Study Champion",
      description: "Complete 100 learning sessions",
      icon: TrendingUp,
      earned: false,
      progress: 35,
      color: "text-green-500",
    },
  ];

  const streakMilestones = [
    { days: 3, title: "Getting Started", color: "bg-blue-500" },
    { days: 7, title: "Week Champion", color: "bg-green-500" },
    { days: 14, title: "Fortnight Hero", color: "bg-yellow-500" },
    { days: 30, title: "Monthly Master", color: "bg-orange-500" },
    { days: 50, title: "Golden Streak", color: "bg-red-500" },
    { days: 100, title: "Century Club", color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Learning Streaks & Achievements
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress and celebrate your learning milestones
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Streak */}
          <div className="lg:col-span-2">
            <LearningStreaks />
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                This Week's Progress
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Monday
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ✓ Completed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tuesday
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ✓ Completed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Wednesday
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    ✓ Completed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Thursday
                  </span>
                  <span className="text-sm font-medium text-orange-600">
                    In Progress
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Friday
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Streak Milestones */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Streak Milestones
              </h3>
              <div className="space-y-3">
                {streakMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${milestone.color}`}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {milestone.days} days - {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Achievements
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Celebrate your learning accomplishments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-2 transition-all ${
                    achievement.earned
                      ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-full ${
                        achievement.earned
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          achievement.earned
                            ? achievement.color
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          achievement.earned
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {achievement.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          achievement.earned
                            ? "text-gray-600 dark:text-gray-400"
                            : "text-gray-500 dark:text-gray-500"
                        }`}
                      >
                        {achievement.description}
                      </p>

                      {achievement.earned && achievement.earnedDate && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Earned on{" "}
                          {new Date(
                            achievement.earnedDate
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {!achievement.earned && achievement.progress && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${achievement.color.replace(
                                "text-",
                                "bg-"
                              )}`}
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Keep Your Learning Streak Alive! 🔥
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Every day you learn is a step towards your goals. Small consistent
            efforts lead to big results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <Calendar className="w-4 h-4 mr-2" />
              Plan Today's Study
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Target className="w-4 h-4 mr-2" />
              Set New Goals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakPage;
