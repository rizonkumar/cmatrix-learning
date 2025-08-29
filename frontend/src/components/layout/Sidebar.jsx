import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  KanbanSquare,
  User,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, onCollapseChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & Progress"
    },
    {
      name: "My Courses",
      href: "/my-courses",
      icon: BookOpen,
      description: "Enrolled Courses"
    },
    {
      name: "Learning Streak",
      href: "/streak",
      icon: Flame,
      description: "Daily Progress"
    },
    {
      name: "TODO List",
      href: "/todo",
      icon: CheckSquare,
      description: "Tasks & Goals"
    },
    {
      name: "Kanban Boards",
      href: "/kanban",
      icon: KanbanSquare,
      description: "Project Management"
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      description: "Account Settings"
    },
  ];

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  const handleNavigation = (href) => {
    navigate(href);
    if (onClose) onClose();
  };

  const isActiveRoute = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-800
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-16" : "lg:w-64"}
          w-64
        `}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student Panel
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Learning Hub
              </p>
            </div>
          ) : (
            <div className="flex-1 flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);

              return (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`
                      w-full group relative flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200
                      ${isCollapsed ? "justify-center" : ""}
                      ${isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      }
                    `}
                  >
                    {/* Icon */}
                    <Icon className={`h-5 w-5 flex-shrink-0 ${!isCollapsed ? "mr-3" : ""} transition-colors`} />

                    {/* Text Content */}
                    {!isCollapsed && (
                      <div className="flex-1 text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </div>
                      </div>
                    )}

                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-blue-600" />
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 rounded-md bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-300">{item.description}</div>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Student Name
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  student@example.com
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
