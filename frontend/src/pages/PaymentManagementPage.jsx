import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, CreditCard, AlertCircle, X } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import UsersPaymentTable from "../components/UsersPaymentTable";
import PaymentDetailsModal from "../components/PaymentDetailsModal";
import PaymentStats from "../components/PaymentStats";
import paymentService from "../services/paymentService";

const PaymentManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: "",
    subscriptionType: "",
    subscriptionStatus: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 0,
    totalUsers: 0,
  });

  // Load users and stats
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stats
      const statsResponse = await paymentService.getPaymentStats();
      setStats(statsResponse.data.data);

      // Load users
      const usersResponse = await paymentService.getAllUsersWithPayments(
        filters,
        pagination.page,
        pagination.limit
      );

      setUsers(usersResponse.data.data.users || []);
      setPagination({
        ...pagination,
        ...usersResponse.data.data.pagination,
      });
    } catch (err) {
      console.error("Error loading payment data:", err);
      setError(err.response?.data?.message || "Failed to load payment data");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => {
    loadData();
  }, []);

  // Handle filter changes - reload data when filters change
  useEffect(() => {
    loadData();
  }, [filters, pagination.page, pagination.limit]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 });
  };

  // Handle search
  const handleSearch = (searchTerm) => {
    handleFilterChange({ search: searchTerm });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Handle user selection for payment details
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowPaymentModal(true);
  };

  // Handle payment update
  const handlePaymentUpdate = async () => {
    await loadData(); // Refresh data
    setShowPaymentModal(false);
    setSelectedUser(null);
  };

  // Refresh data
  const handleRefresh = () => {
    loadData();
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 rounded-2xl p-6 lg:p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Finance Management Dashboard
            </h1>
            <p className="text-green-100 text-lg lg:text-xl mb-6 leading-relaxed">
              Monitor student payments, subscriptions, and financial analytics
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Tracking</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Revenue Analytics</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">Finance Hub</div>
                  <div className="text-sm text-green-100 font-medium">
                    Complete Overview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <ArrowLeft className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                placeholder="Search students by name, email, course..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange({ search: "" })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Error Loading Data
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
              <button
                onClick={loadData}
                className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && users.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Loading payment data...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Statistics */}
      {stats && <PaymentStats stats={stats} />}

      {/* Users Payment Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <UsersPaymentTable
          users={users}
          loading={loading && users.length === 0}
          filters={filters}
          pagination={pagination}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onUserSelect={handleUserSelect}
        />
      </div>

      {/* Payment Details Modal */}
      {showPaymentModal && selectedUser && (
        <PaymentDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handlePaymentUpdate}
        />
      )}
    </div>
  );
};

export default PaymentManagementPage;
