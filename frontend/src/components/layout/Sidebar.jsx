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
      description: "Overview & Progress",
      color: "text-blue-600 dark:text-blue-400",
      hoverColor: "hover:text-blue-700 dark:hover:text-blue-300",
      bgHoverColor: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
      activeBgColor: "bg-blue-50 dark:bg-blue-900/50",
      activeTextColor: "text-blue-700 dark:text-blue-300",
      activeIndicatorColor: "bg-blue-500",
      iconBgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconHoverBgColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      name: "My Courses",
      href: "/my-courses",
      icon: BookOpen,
      description: "Enrolled Courses",
      color: "text-emerald-600 dark:text-emerald-400",
      hoverColor: "hover:text-emerald-700 dark:hover:text-emerald-300",
      bgHoverColor: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
      activeBgColor: "bg-emerald-50 dark:bg-emerald-900/50",
      activeTextColor: "text-emerald-700 dark:text-emerald-300",
      activeIndicatorColor: "bg-emerald-500",
      iconBgColor: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      iconHoverBgColor: "hover:from-emerald-600 hover:to-emerald-700",
    },
    {
      name: "Learning Streak",
      href: "/streak",
      icon: Flame,
      description: "Daily Progress",
      color: "text-orange-600 dark:text-orange-400",
      hoverColor: "hover:text-orange-700 dark:hover:text-orange-300",
      bgHoverColor: "hover:bg-orange-50 dark:hover:bg-orange-900/30",
      activeBgColor: "bg-orange-50 dark:bg-orange-900/50",
      activeTextColor: "text-orange-700 dark:text-orange-300",
      activeIndicatorColor: "bg-orange-500",
      iconBgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconHoverBgColor: "hover:from-orange-600 hover:to-orange-700",
    },
    {
      name: "TODO List",
      href: "/todo",
      icon: CheckSquare,
      description: "Tasks & Goals",
      color: "text-purple-600 dark:text-purple-400",
      hoverColor: "hover:text-purple-700 dark:hover:text-purple-300",
      bgHoverColor: "hover:bg-purple-50 dark:hover:bg-purple-900/30",
      activeBgColor: "bg-purple-50 dark:bg-purple-900/50",
      activeTextColor: "text-purple-700 dark:text-purple-300",
      activeIndicatorColor: "bg-purple-500",
      iconBgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconHoverBgColor: "hover:from-purple-600 hover:to-purple-700",
    },
    {
      name: "Kanban Boards",
      href: "/kanban",
      icon: KanbanSquare,
      description: "Project Management",
      color: "text-indigo-600 dark:text-indigo-400",
      hoverColor: "hover:text-indigo-700 dark:hover:text-indigo-300",
      bgHoverColor: "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
      activeBgColor: "bg-indigo-50 dark:bg-indigo-900/50",
      activeTextColor: "text-indigo-700 dark:text-indigo-300",
      activeIndicatorColor: "bg-indigo-500",
      iconBgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      iconHoverBgColor: "hover:from-indigo-600 hover:to-indigo-700",
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      description: "Account Settings",
      color: "text-gray-600 dark:text-gray-400",
      hoverColor: "hover:text-gray-700 dark:hover:text-gray-300",
      bgHoverColor: "hover:bg-gray-50 dark:hover:bg-gray-800",
      activeBgColor: "bg-gray-50 dark:bg-gray-800",
      activeTextColor: "text-gray-700 dark:text-gray-300",
      activeIndicatorColor: "bg-gray-500",
      iconBgColor: "bg-gradient-to-br from-gray-500 to-gray-600",
      iconHoverBgColor: "hover:from-gray-600 hover:to-gray-700",
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
          lg:translate-x-0 lg:top-16 lg:h-[calc(100vh-4rem)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-16" : "lg:w-64"}
          w-64
          top-0 lg:top-16
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 group hover:scale-105"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
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
                      ${
                        isActive
                          ? `${item.activeBgColor} ${item.activeTextColor} shadow-sm`
                          : `text-gray-700 ${item.bgHoverColor} ${item.hoverColor} dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white`
                      }
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`flex items-center justify-center ${
                        !isCollapsed ? "mr-3" : ""
                      } transition-all duration-200`}
                    >
                      <div
                        className={`p-1.5 rounded-md ${item.iconBgColor} ${item.iconHoverBgColor} shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:scale-105`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-white drop-shadow-sm" />
                      </div>
                    </div>

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
                      <div
                        className={`absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r ${item.activeIndicatorColor}`}
                      />
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 rounded-md bg-gray-900 dark:bg-gray-800 px-3 py-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-lg border border-gray-700">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-1 rounded ${item.iconBgColor} ${item.iconHoverBgColor}`}
                          >
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-gray-300 dark:text-gray-400">
                              {item.description}
                            </div>
                          </div>
                        </div>
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
          <div className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-100 dark:ring-blue-900/30 group-hover:ring-blue-200 dark:group-hover:ring-blue-800/50 transition-all duration-200 hover:scale-105">
              <User className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
