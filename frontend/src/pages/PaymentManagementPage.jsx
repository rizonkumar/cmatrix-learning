import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, CreditCard, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Header aligned with CourseManagementPage style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Finance Management
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
                Manage student payments and subscriptions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-6 py-3 w-fit cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error Loading Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
                <button
                  onClick={loadData}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && users.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <LoadingSpinner />
              <p className="text-gray-500 dark:text-gray-400 mt-4">
                Loading payment data...
              </p>
            </div>
          </div>
        )}

        {/* Payment Statistics */}
        {stats && <PaymentStats stats={stats} />}

        {/* Users Payment Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
