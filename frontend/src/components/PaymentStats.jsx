import React from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
} from "lucide-react";

const PaymentStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "partial":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "overdue":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "partial":
        return "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "overdue":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div className="mb-8">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900   dark:text-white">
                {formatCurrency(stats.totalPaidAmount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.period || "All time"}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Subscriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Subscriptions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSubscriptions || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.period || "All time"}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Amount
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalPendingAmount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Outstanding payments
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalAmount || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Expected revenue
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Type Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Subscription Types</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.subscriptionTypeBreakdown || {}).map(
            ([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                    {type.replace("-", " ")}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {count}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    type === "monthly"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : type === "6-months"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-purple-100 dark:bg-purple-900/30"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      type === "monthly"
                        ? "text-blue-600 dark:text-blue-400"
                        : type === "6-months"
                        ? "text-green-600 dark:text-green-400"
                        : "text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {type === "6-months" ? "6M" : type.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment Status Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Payment Status</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.subscriptionStatusBreakdown || {}).map(
            ([status, count]) => (
              <div
                key={status}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(
                  status
                )}`}
              >
                <div className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <div>
                    <p className="text-sm font-medium capitalize">{status}</p>
                    <p className="text-lg font-bold">{count}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;
