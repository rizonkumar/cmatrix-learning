import React from "react";
import Profile from "../components/Profile";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-tr from-indigo-400/10 via-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          <Profile />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
