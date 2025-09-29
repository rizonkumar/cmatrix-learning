import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import Button from "./common/Button";
import Input from "./common/Input";

const UsersPaymentTable = ({
  users,
  loading,
  filters,
  pagination,
  onFilterChange,
  onSearch,
  onPageChange,
  onUserSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);

  // Handle search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  // Keep local search state in sync with external filters (e.g., when cleared)
  React.useEffect(() => {
    if ((filters.search || "") !== searchTerm) {
      setSearchTerm(filters.search || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // Debounced server-side searching while typing
  React.useEffect(() => {
    const id = setTimeout(() => {
      onSearch(searchTerm);
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "paid":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "Paid",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          text: "Pending",
        };
      case "partial":
        return {
          icon: AlertCircle,
          color: "text-orange-600 dark:text-orange-400",
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "Partial",
        };
      case "overdue":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/30",
          text: "Overdue",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-gray-900/30",
          text: "Unknown",
        };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get subscription type badge color
  const getSubscriptionTypeColor = (type) => {
    switch (type) {
      case "monthly":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "6-months":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "yearly":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 w-full sm:max-w-md"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, email, course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
            {searchTerm && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange("paymentStatus", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription Type
              </label>
              <select
                value={filters.subscriptionType}
                onChange={(e) =>
                  handleFilterChange("subscriptionType", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Types</option>
                <option value="monthly">Monthly</option>
                <option value="6-months">6 Months</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class Level
              </label>
              <select
                value={filters.classLevel}
                onChange={(e) =>
                  handleFilterChange("classLevel", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Classes</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
                <option value="JEE Main">JEE Main</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="NEET">NEET</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Subjects</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mobile list (smaller than sm) */}
      <div className="sm:hidden space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No students found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm.trim()
                ? "Try adjusting your search criteria"
                : "Students will appear here once they have subscriptions"}
            </p>
          </div>
        ) : (
          users.map((user) => {
            const latestSubscription = user.subscriptions?.[0];
            const statusInfo = getStatusInfo(latestSubscription?.paymentStatus);
            return (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold text-lg">
                      {user.fullName?.charAt(0) ||
                        user.username?.charAt(0) ||
                        "U"}
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUserSelect(user)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Course
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {latestSubscription?.courseName || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Status
                    </div>
                    <div className={`font-semibold ${statusInfo.color}`}>
                      {statusInfo.text}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Amount
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(latestSubscription?.amount || 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1">
                      Valid Till
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {latestSubscription?.endDate
                        ? formatDate(latestSubscription.endDate)
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Course & Class
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Subscription
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Payment Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Valid Till
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-400 text-lg">
                          Loading...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No students found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          {searchTerm.trim()
                            ? "Try adjusting your search criteria"
                            : "Students will appear here once they have subscriptions"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const latestSubscription = user.subscriptions?.[0];
                    const statusInfo = getStatusInfo(
                      latestSubscription?.paymentStatus
                    );

                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                                <span className="text-lg font-semibold text-white">
                                  {user.fullName?.charAt(0) ||
                                    user.username?.charAt(0) ||
                                    "U"}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-400 dark:text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-lg text-gray-900 dark:text-white font-medium">
                            {latestSubscription?.courseName || "N/A"}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {latestSubscription?.classLevel || "N/A"}
                            </span>
                            <span className="text-sm text-gray-400">•</span>
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {latestSubscription?.subject || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSubscriptionTypeColor(
                              latestSubscription?.subscriptionType
                            )}`}
                          >
                            {latestSubscription?.subscriptionType?.replace(
                              "-",
                              " "
                            ) || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}
                            >
                              <statusInfo.icon
                                className={`w-5 h-5 ${statusInfo.color}`}
                              />
                            </div>
                            <span
                              className={`text-lg font-semibold ${statusInfo.color}`}
                            >
                              {statusInfo.text}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-lg text-gray-900 dark:text-white font-semibold">
                            {formatCurrency(latestSubscription?.amount || 0)}
                          </div>
                          {latestSubscription?.pendingAmount > 0 && (
                            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                              Pending:{" "}
                              {formatCurrency(latestSubscription.pendingAmount)}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-lg text-gray-600 dark:text-gray-400 font-medium">
                          {latestSubscription?.endDate
                            ? formatDate(latestSubscription.endDate)
                            : "N/A"}
                        </td>

                        <td className="px-6 py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onUserSelect(user);
                            }}
                            className="flex items-center gap-2 px-4 py-2 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={pagination.currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronsLeft className="w-4 h-4" />
              <span>First</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const page =
                    Math.max(
                      1,
                      Math.min(
                        pagination.totalPages - 4,
                        pagination.currentPage - 2
                      )
                    ) + i;
                  if (page > pagination.totalPages) return null;

                  return (
                    <Button
                      key={page}
                      variant={
                        page === pagination.currentPage ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span>Last</span>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPaymentTable;
