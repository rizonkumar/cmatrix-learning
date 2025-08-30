import React from 'react';

/**
 * SkeletonLoader Component
 * Provides animated skeleton loading states
 */

const SkeletonLoader = ({
  className = '',
  variant = 'default',
  width = '100%',
  height = 'auto',
  rounded = true
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'h-10 w-10 rounded-full',
    card: 'h-48 rounded-lg',
    button: 'h-10 rounded-md',
    input: 'h-10 rounded-md',
    default: ''
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${rounded ? 'rounded' : ''} ${className}`}
      style={{ width, height }}
    />
  );
};

/**
 * CourseCardSkeleton - Skeleton for course cards
 */
export const CourseCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    <SkeletonLoader variant="card" />
    <div className="p-6 space-y-4">
      <SkeletonLoader variant="title" width="80%" />
      <SkeletonLoader variant="text" width="60%" />
      <div className="flex items-center space-x-2">
        <SkeletonLoader variant="avatar" />
        <SkeletonLoader variant="text" width="100px" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" width="60px" />
        <SkeletonLoader variant="button" width="100px" />
      </div>
    </div>
  </div>
);

/**
 * KanbanCardSkeleton - Skeleton for kanban cards
 */
export const KanbanCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 mb-3">
    <div className="space-y-3">
      <SkeletonLoader variant="title" width="90%" />
      <SkeletonLoader variant="text" width="70%" />
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" width="60px" />
        <SkeletonLoader variant="text" width="40px" />
      </div>
    </div>
  </div>
);

/**
 * ProfileSkeleton - Skeleton for profile sections
 */
export const ProfileSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-8">
    {/* Profile Header Skeleton */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <SkeletonLoader height="120px" />
      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16 sm:-mt-12">
          <SkeletonLoader variant="avatar" className="w-24 h-24 sm:w-32 sm:h-32" />
          <div className="flex-1 min-w-0">
            <SkeletonLoader variant="title" width="200px" className="mb-2" />
            <SkeletonLoader variant="text" width="120px" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SkeletonLoader variant="text" width="80px" className="mb-2" />
              <SkeletonLoader variant="title" width="40px" />
            </div>
            <SkeletonLoader width="40px" height="40px" rounded />
          </div>
        </div>
      ))}
    </div>

    {/* Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <SkeletonLoader variant="title" width="150px" />
            </div>
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center space-x-3">
                  <SkeletonLoader width="20px" height="20px" rounded />
                  <SkeletonLoader variant="text" width="200px" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Skeleton */}
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <SkeletonLoader variant="title" width="120px" />
            </div>
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, j) => (
                <SkeletonLoader key={j} variant="button" width="100%" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * CourseListSkeleton - Skeleton for course list view
 */
export const CourseListSkeleton = ({ count = 6 }) => (
  <div className="space-y-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <SkeletonLoader width="80px" height="80px" rounded />
          <div className="flex-1 space-y-3">
            <SkeletonLoader variant="title" width="60%" />
            <SkeletonLoader variant="text" width="40%" />
            <div className="flex justify-between items-center">
              <SkeletonLoader variant="text" width="100px" />
              <SkeletonLoader variant="button" width="80px" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * StatsCardSkeleton - Skeleton for stats cards
 */
export const StatsCardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <SkeletonLoader variant="text" width="80px" className="mb-2" />
            <SkeletonLoader variant="title" width="40px" />
          </div>
          <SkeletonLoader width="40px" height="40px" rounded />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
