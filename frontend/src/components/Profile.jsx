import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Award,
  BookOpen,
  Clock,
  Flame,
  Camera,
  Edit3,
  Shield,
  Bell,
  Download,
  Trash2,
  LogOut,
  CheckCircle,
  Settings,
  MapPin,
  Phone,
  Globe,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import useTheme from "../hooks/useTheme";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { LoadingSpinner } from "./common/LoadingSpinner";
import Button from "./common/Button";
import Input from "./common/Input";
import Modal from "./common/Modal";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { isDark } = useTheme();
  const fileInputRef = useRef(null);

  // API state
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // State for account operations
  const [signingOut, setSigningOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
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
        phone: profileResponse.data.user.phone || "",
        bio: profileResponse.data.user.bio || "",
        location: profileResponse.data.user.location || "",
        website: profileResponse.data.user.website || "",
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

  const achievements = [
    {
      id: 1,
      title: "First Course Completed",
      icon: Award,
      color: "text-yellow-500",
      earned: true,
    },
    {
      id: 2,
      title: "7-Day Streak",
      icon: Flame,
      color: "text-orange-500",
      earned: true,
    },
    {
      id: 3,
      title: "Study Champion",
      icon: BookOpen,
      color: "text-blue-500",
      earned: false,
    },
    {
      id: 4,
      title: "Perfect Score",
      icon: CheckCircle,
      color: "text-green-500",
      earned: true,
    },
  ];

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you'd upload the file to your server
      const reader = new FileReader();
      reader.onload = (e) => {
        updateUser({ avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = () => {
    updateUser(editForm);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authService.logout();
      logout(); // Clear auth state in store
      toast.success("Signed out successfully");
      // Redirect to login page (this will be handled by the router)
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await userService.deleteAccount({
        reason: "User requested account deletion",
        confirmPassword: "", // Could add password confirmation in the future
      });
      logout(); // Clear auth state in store
      toast.success("Account deleted successfully");
      // Redirect to home page (this will be handled by the router)
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color = "text-blue-600",
    bgColor = "bg-blue-100",
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor} dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16 sm:-mt-12">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Camera className="w-4 h-4" />
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
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {user?.name || "User Name"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {user?.role?.charAt(0).toUpperCase() +
                      user?.role?.slice(1) || "Student"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Joined{" "}
                    {userStats?.joinedDate
                      ? new Date(userStats.joinedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Loading..."}
                  </p>
                </div>

                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2"
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          icon={Flame}
          title="Current Streak"
          value={
            userStats?.currentStreak
              ? `${userStats.currentStreak} days`
              : "0 days"
          }
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        <StatCard
          icon={Clock}
          title="Study Time"
          value={userStats?.totalStudyTime || "0h 0m"}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={BookOpen}
          title="Courses Done"
          value={userStats?.coursesCompleted || "0"}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={Award}
          title="Certificates"
          value={userStats?.certificatesEarned || "0"}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {editForm.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {editForm.phone}
                      </p>
                    </div>
                  </div>
                )}

                {editForm.location && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Location
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {editForm.location}
                      </p>
                    </div>
                  </div>
                )}

                {editForm.website && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Website
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {editForm.website}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {editForm.bio && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Bio
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {editForm.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Achievements
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg text-center transition-all ${
                        achievement.earned
                          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 mx-auto mb-2 ${
                          achievement.earned
                            ? achievement.color
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          achievement.earned
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Account Settings
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Notifications
                  </span>
                </div>
                <span className="text-xs text-gray-500">Manage</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Privacy & Security
                  </span>
                </div>
                <span className="text-xs text-gray-500">Update</span>
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Export Data
                  </span>
                </div>
                <span className="text-xs text-gray-500">Download</span>
              </button>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Management
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signingOut ? (
                  <LoadingSpinner className="w-5 h-5" />
                ) : (
                  <LogOut className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {signingOut ? "Signing Out..." : "Sign Out"}
                </span>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
              >
                <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400">
                  Delete Account
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={editForm.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Input
            label="Phone"
            type="tel"
            value={editForm.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter your phone number"
          />
          <Input
            label="Location"
            value={editForm.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="City, Country"
          />
          <Input
            label="Website"
            value={editForm.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            placeholder="https://yourwebsite.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={editForm.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                Are you sure?
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
