import React from 'react';
import Profile from '../components/Profile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-8">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;
