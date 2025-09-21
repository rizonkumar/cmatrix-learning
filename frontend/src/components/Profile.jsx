import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Award,
  BookOpen,
  Clock,
  Flame,
  Camera,
  Edit3,
  Trash2,
  CheckCircle,
  Calendar,
  Trophy,
  Target,
  Shield,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { userService } from "../services/userService";
import { LoadingSpinner } from "./common/LoadingSpinner";
import Button from "./common/Button";
import Input from "./common/Input";
import Modal from "./common/Modal";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const fileInputRef = useRef(null);

  // API state
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for account operations
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
  });

  // Load profile data
  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileResponse, statsResponse] = await Promise.all([
        userService.getProfile(),
        userService.getUserStats(),
      ]);

      setProfileData(profileResponse.data.user);
      setUserStats(statsResponse.data.stats);

      // Update edit form with current data
      setEditForm({
        fullName: profileResponse.data.user.fullName || "",
        email: profileResponse.data.user.email || "",
      });
    } catch (err) {
      setError("Failed to load profile data");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Get achievements from API or use defaults
  const getAchievements = () => {
    if (userStats?.achievements && userStats.achievements.length > 0) {
      return userStats.achievements.map((achievement, index) => ({
        id: index + 1,
        title: achievement,
        icon: Award,
        color: "text-yellow-500",
        earned: true,
      }));
    }

    // Default achievements if none from API
    return [
      {
        id: 1,
        title: "First Course Completed",
        icon: Award,
        color: "text-yellow-500",
        earned: false,
      },
      {
        id: 2,
        title: "7-Day Streak",
        icon: Flame,
        color: "text-orange-500",
        earned: userStats?.currentStreak >= 7,
      },
      {
        id: 3,
        title: "Study Champion",
        icon: BookOpen,
        color: "text-blue-500",
        earned: userStats?.totalLessonsCompleted > 10,
      },
      {
        id: 4,
        title: "Perfect Score",
        icon: CheckCircle,
        color: "text-green-500",
        earned: false,
      },
    ];
  };

  const achievements = getAchievements();

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast.error(
            "Please select a valid image file (JPEG, PNG, GIF, or WebP)"
          );
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size must be less than 5MB");
          return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        const response = await userService.uploadAvatar(formData);

        updateUser({ avatar: response.data.avatar });

        toast.success("Avatar uploaded successfully!");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Failed to upload avatar. Please try again.");
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      // Update profile via API
      const response = await userService.updateProfile(editForm);

      // Update local store
      updateUser(editForm);

      // Update profile data state with response
      if (response.data.user) {
        setProfileData(response.data.user);
      }

      // Close modal and show success message
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await userService.deleteAccount({
        reason: "User requested account deletion",
        confirmPassword: "", // Could add password confirmation in the future
      });
      logout();
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const StatCard = ({
    icon,
    title,
    value,
    color = "text-blue-600",
    bgColor = "bg-blue-100",
    subtitle,
  }) => {
    const Icon = icon;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 truncate">
              {title}
            </p>
            <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={`p-3 lg:p-4 rounded-xl ${bgColor} dark:bg-opacity-20 flex-shrink-0 ml-3`}
          >
            <Icon className={`w-5 h-5 lg:w-7 lg:h-7 ${color}`} />
          </div>
        </div>
      </div>
    );
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state if data failed to load
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <Button onClick={loadProfileData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="relative h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-6 right-6">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-sm font-medium text-white/90">
                Verified Student
              </span>
            </div>
          </div>
        </div>

        <div className="relative px-8 pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end space-y-6 lg:space-y-0 lg:space-x-8 -mt-20 lg:-mt-16">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-lg">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 lg:w-20 lg:h-20 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0 lg:mb-4">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    {profileData?.fullName || user?.name || "User Name"}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                      {user?.role?.charAt(0).toUpperCase() +
                        user?.role?.slice(1) || "Student"}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email || "user@example.com"}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {profileData?.createdAt
                          ? new Date(profileData.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                          : "Loading..."}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>Top Performer</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 lg:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        <StatCard
          icon={Flame}
          title="Current Streak"
          value={
            userStats?.currentStreak
              ? `${userStats.currentStreak} days`
              : "0 days"
          }
          subtitle="Keep it up!"
          color="text-orange-600"
          bgColor="bg-gradient-to-br from-orange-100 to-red-100"
        />
        <StatCard
          icon={Trophy}
          title="Longest Streak"
          value={
            userStats?.longestStreak
              ? `${userStats.longestStreak} days`
              : "0 days"
          }
          subtitle="Personal best"
          color="text-yellow-600"
          bgColor="bg-gradient-to-br from-yellow-100 to-orange-100"
        />
        <StatCard
          icon={Clock}
          title="Study Time"
          value={userStats?.totalStudyTime || "0h 0m"}
          subtitle="This week"
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-100 to-indigo-100"
        />
        <StatCard
          icon={BookOpen}
          title="Courses Enrolled"
          value={userStats?.totalCoursesEnrolled || "0"}
          subtitle="Active courses"
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-100 to-emerald-100"
        />
        <StatCard
          icon={Target}
          title="Lessons Completed"
          value={userStats?.totalLessonsCompleted || "0"}
          subtitle="All time"
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-100 to-pink-100"
        />
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-yellow-600" />
            Achievements & Badges
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your learning milestones and accomplishments
          </p>
        </div>
        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`group relative p-6 rounded-2xl text-center transition-all duration-300 cursor-pointer ${
                    achievement.earned
                      ? "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-2 border-yellow-200 dark:border-yellow-800 shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {achievement.earned && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      achievement.earned
                        ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-800/30 dark:to-orange-800/30"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        achievement.earned ? achievement.color : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-bold text-sm mb-2 ${
                      achievement.earned
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`text-xs ${
                      achievement.earned
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-400"
                    }`}
                  >
                    {achievement.earned ? "Unlocked" : "Locked"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              value={editForm.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
            />
            <Input
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="px-6">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200 dark:border-red-800">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800 dark:text-red-200">
                Are you absolutely sure?
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                This action cannot be undone. All your data, courses, progress,
                and achievements will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Before you delete:</strong> Consider downloading your data
              or contacting support if you need help with your account.
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="px-6"
            >
              Keep Account
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="px-6 bg-red-600 hover:bg-red-700"
            >
              {deletingAccount ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting Account...</span>
                </div>
              ) : (
                "Delete Account"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
