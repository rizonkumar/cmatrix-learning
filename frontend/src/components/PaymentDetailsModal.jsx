import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  CreditCard,
  Calendar,
  Plus,
  Save,
  User,
  BookOpen,
  GraduationCap,
  Edit3,
  Trash2,
  DollarSign,
} from "lucide-react";
import Button from "./common/Button";
import Input from "./common/Input";
import Modal from "./common/Modal";
import paymentService from "../services/paymentService";

const PaymentDetailsModal = ({ user, onClose, onUpdate }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [adjustingPending, setAdjustingPending] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: "",
  });
  const [pendingForm, setPendingForm] = useState({
    pendingAmount: "",
  });
  const [paymentEditForm, setPaymentEditForm] = useState({
    amount: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: "",
    paymentDate: "",
  });

  // Load user's subscription details
  useEffect(() => {
    const loadSubscriptionDetails = async () => {
      try {
        setLoading(true);
        console.log("Loading subscription details for user:", user);
        console.log("User ID:", user._id);
        console.log("User subscriptions from table:", user.subscriptions);

        const response = await paymentService.getUserSubscriptionDetails(
          user._id
        );
        console.log("API Response:", response);
        console.log("Subscription data:", response.data.subscriptions);

        setSubscriptions(response.data.subscriptions || []);
      } catch (err) {
        console.error("Error loading subscription details:", err);
        console.error("Error response:", err.response);
        setError(
          err.response?.data?.message || "Failed to load subscription details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSubscriptionDetails();
    }
  }, [user]);

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

  // Handle payment form submission
  const handlePaymentSubmit = async (subscriptionId) => {
    try {
      const amount = parseFloat(paymentForm.amount);
      if (amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      await paymentService.addPaymentToHistory(subscriptionId, {
        amount,
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes,
      });

      // Reset form
      setPaymentForm({
        amount: "",
        paymentMethod: "cash",
        transactionId: "",
        notes: "",
      });
      setEditingSubscription(null);

      // Refresh data
      onUpdate();
    } catch (err) {
      console.error("Error adding payment:", err);
      alert(err.response?.data?.message || "Failed to add payment");
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (subscriptionId) => {
    try {
      await paymentService.markAsPaid(subscriptionId, {
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId,
        notes: paymentForm.notes,
      });

      // Reset form
      setPaymentForm({
        amount: "",
        paymentMethod: "cash",
        transactionId: "",
        notes: "",
      });
      setEditingSubscription(null);

      // Refresh data
      onUpdate();
    } catch (err) {
      console.error("Error marking as paid:", err);
      alert(err.response?.data?.message || "Failed to mark as paid");
    }
  };

  // Handle pending amount update
  const handlePendingAmountUpdate = async (subscriptionId, pendingAmount) => {
    try {
      await paymentService.updatePendingAmount(
        subscriptionId,
        parseFloat(pendingAmount)
      );
      setAdjustingPending(null);
      setPendingForm({ pendingAmount: "" });
      onUpdate();
    } catch (err) {
      console.error("Error updating pending amount:", err);
      alert(err.response?.data?.message || "Failed to update pending amount");
    }
  };

  // Handle payment edit
  const handlePaymentEdit = (subscriptionId, paymentIndex, payment) => {
    setEditingPayment({ subscriptionId, paymentIndex, payment });
    setPaymentEditForm({
      amount: payment.amount.toString(),
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId || "",
      notes: payment.notes || "",
      paymentDate: payment.paymentDate
        ? new Date(payment.paymentDate).toISOString().split("T")[0]
        : "",
    });
  };

  // Handle payment edit submit
  const handlePaymentEditSubmit = async () => {
    if (!editingPayment) return;

    try {
      const { subscriptionId, paymentIndex, payment } = editingPayment;

      await paymentService.editPaymentHistory(subscriptionId, payment._id, {
        amount: parseFloat(paymentEditForm.amount),
        paymentMethod: paymentEditForm.paymentMethod,
        transactionId: paymentEditForm.transactionId,
        notes: paymentEditForm.notes,
        paymentDate: new Date(
          paymentEditForm.paymentDate || payment.paymentDate
        ),
      });

      setEditingPayment(null);
      setPaymentEditForm({
        amount: "",
        paymentMethod: "cash",
        transactionId: "",
        notes: "",
        paymentDate: "",
      });

      // Refresh data
      onUpdate();
    } catch (err) {
      console.error("Error editing payment:", err);
      alert(err.response?.data?.message || "Failed to edit payment");
    }
  };

  // Handle payment delete
  const handlePaymentDelete = async (subscriptionId, paymentIndex, payment) => {
    if (!confirm("Are you sure you want to delete this payment record?"))
      return;

    try {
      await paymentService.deletePaymentHistory(subscriptionId, payment._id);

      onUpdate();
    } catch (err) {
      console.error("Error deleting payment:", err);
      alert(err.response?.data?.message || "Failed to delete payment");
    }
  };

  if (loading) {
    return (
      <Modal isOpen={true} onClose={onClose}>
        <div className="flex items-center justify-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 dark:border-gray-700 border-t-blue-600"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="2xl"
      title={
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.username} • {user.email}
            </p>
            {user.role && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mt-1">
                {user.role}
              </span>
            )}
          </div>
        </div>
      }
    >
      <div className="max-h-[calc(90vh-12rem)] overflow-y-auto">
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Error Loading Data
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Stats Overview */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Total Subscriptions
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {subscriptions.length}
                </p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  {subscriptions.length === 0 ? "No subscriptions" : "All time"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
                  Active Subscriptions
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {
                    subscriptions.filter(
                      (s) =>
                        s.paymentStatus === "paid" &&
                        new Date(s.endDate) > new Date()
                    ).length
                  }
                </p>
                <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                  Currently active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-800/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                  Pending Amount
                </p>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                  ₹
                  {subscriptions
                    .reduce((sum, s) => sum + (s.pendingAmount || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                  Outstanding
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                  Total Paid
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  ₹
                  {subscriptions
                    .reduce((sum, s) => {
                      const totalPaid = (function () {
                        try {
                          if (typeof s.getTotalPaidAmount === "function") {
                            return s.getTotalPaidAmount();
                          }
                        } catch {
                          // Ignore errors from getTotalPaidAmount method
                        }
                        const history = Array.isArray(s.paymentHistory)
                          ? s.paymentHistory
                          : [];
                        return history.reduce(
                          (hSum, p) => hSum + (parseFloat(p.amount) || 0),
                          0
                        );
                      })();
                      return sum + totalPaid;
                    }, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-400 mt-1">
                  Total payments
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Cards */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
            <CreditCard className="w-7 h-7 text-green-600 dark:text-green-400" />
            <span>
              Subscriptions ({subscriptions.length})
              {subscriptions.length === 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  - None found
                </span>
              )}
            </span>
          </h3>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Loading subscriptions...
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                Fetching payment and subscription data...
              </p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CreditCard className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No subscriptions found
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                This user doesn't have any active subscriptions. They may need
                to enroll in courses first.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Tip:</strong> Students need to enroll in courses
                  and set up payment plans to appear here.
                </p>
              </div>
            </div>
          ) : (
            subscriptions.map((subscription) => {
              const statusInfo = getStatusInfo(subscription.paymentStatus);
              const isEditing = editingSubscription === subscription._id;
              const totalPaid = (function () {
                try {
                  if (typeof subscription.getTotalPaidAmount === "function") {
                    return subscription.getTotalPaidAmount();
                  }
                } catch {
                  // Ignore errors from getTotalPaidAmount method
                }
                const history = Array.isArray(subscription.paymentHistory)
                  ? subscription.paymentHistory
                  : [];
                return history.reduce(
                  (sum, p) => sum + (parseFloat(p.amount) || 0),
                  0
                );
              })();
              const remainingAmount = Math.max(
                (subscription.amount || 0) - totalPaid,
                0
              );

              return (
                <div
                  key={subscription._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Subscription Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${statusInfo.bg} shadow-md flex-shrink-0`}
                      >
                        <statusInfo.icon
                          className={`w-6 h-6 ${statusInfo.color}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                          {subscription.courseName || "Course Not Specified"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full font-semibold text-xs ${getSubscriptionTypeColor(
                              subscription.subscriptionType
                            )}`}
                          >
                            {subscription.subscriptionType?.replace("-", " ")}
                          </span>
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <GraduationCap className="w-4 h-4" />
                            <span className="truncate">
                              {subscription.classLevel || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            <span className="truncate">
                              {subscription.subject || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left lg:text-right">
                      <div className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {formatCurrency(subscription.amount)}
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                          subscription.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : subscription.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : subscription.paymentStatus === "partial"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {subscription.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Payment Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Payment Progress
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(totalPaid)} /{" "}
                        {formatCurrency(subscription.amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(totalPaid / subscription.amount) * 100}%`,
                        }}
                      ></div>
                    </div>
                    {subscription.pendingAmount > 0 && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                        Pending: {formatCurrency(subscription.pendingAmount)}
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Start:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(subscription.startDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        End:
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(subscription.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Payment History */}
                  {Array.isArray(subscription.paymentHistory) &&
                    subscription.paymentHistory.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                            Payment History
                          </h5>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() =>
                                setAdjustingPending(subscription._id)
                              }
                              className="flex items-center space-x-1"
                            >
                              <DollarSign className="w-3 h-3" />
                              <span>Adjust Pending</span>
                            </Button>
                          </div>
                        </div>

                        {/* Pending Amount Adjustment Form */}
                        {adjustingPending === subscription._id && (
                          <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <h6 className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                              Adjust Pending Amount
                            </h6>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                placeholder="New pending amount"
                                value={pendingForm.pendingAmount}
                                onChange={(e) =>
                                  setPendingForm({
                                    ...pendingForm,
                                    pendingAmount: e.target.value,
                                  })
                                }
                                className="text-xs"
                              />
                              <Button
                                size="xs"
                                onClick={() =>
                                  handlePendingAmountUpdate(
                                    subscription._id,
                                    pendingForm.pendingAmount
                                  )
                                }
                                className="flex items-center space-x-1"
                              >
                                <Save className="w-3 h-3" />
                                <span>Update</span>
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                  setAdjustingPending(null);
                                  setPendingForm({ pendingAmount: "" });
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="rounded-lg border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-900/30">
                          {subscription.paymentHistory
                            .slice()
                            .sort(
                              (a, b) =>
                                new Date(b.paymentDate) -
                                new Date(a.paymentDate)
                            )
                            .map((pmt, idx) => (
                              <div key={idx}>
                                {/* Payment History Item */}
                                {editingPayment &&
                                editingPayment.subscriptionId ===
                                  subscription._id &&
                                editingPayment.paymentIndex === idx ? (
                                  // Edit Form
                                  <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                                    <h6 className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                                      Edit Payment
                                    </h6>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                      <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={paymentEditForm.amount}
                                        onChange={(e) =>
                                          setPaymentEditForm({
                                            ...paymentEditForm,
                                            amount: e.target.value,
                                          })
                                        }
                                        className="text-xs"
                                      />
                                      <select
                                        value={paymentEditForm.paymentMethod}
                                        onChange={(e) =>
                                          setPaymentEditForm({
                                            ...paymentEditForm,
                                            paymentMethod: e.target.value,
                                          })
                                        }
                                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
                                      >
                                        <option value="cash">Cash</option>
                                        <option value="online">Online</option>
                                        <option value="bank-transfer">
                                          Bank Transfer
                                        </option>
                                        <option value="cheque">Cheque</option>
                                        <option value="other">Other</option>
                                      </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                      <Input
                                        type="text"
                                        placeholder="Transaction ID"
                                        value={paymentEditForm.transactionId}
                                        onChange={(e) =>
                                          setPaymentEditForm({
                                            ...paymentEditForm,
                                            transactionId: e.target.value,
                                          })
                                        }
                                        className="text-xs"
                                      />
                                      <Input
                                        type="date"
                                        placeholder="Payment Date"
                                        value={paymentEditForm.paymentDate}
                                        onChange={(e) =>
                                          setPaymentEditForm({
                                            ...paymentEditForm,
                                            paymentDate: e.target.value,
                                          })
                                        }
                                        className="text-xs"
                                      />
                                      <Input
                                        type="text"
                                        placeholder="Notes"
                                        value={paymentEditForm.notes}
                                        onChange={(e) =>
                                          setPaymentEditForm({
                                            ...paymentEditForm,
                                            notes: e.target.value,
                                          })
                                        }
                                        className="text-xs"
                                      />
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="xs"
                                        onClick={handlePaymentEditSubmit}
                                        className="flex items-center space-x-1"
                                      >
                                        <Save className="w-3 h-3" />
                                        <span>Save</span>
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingPayment(null);
                                          setPaymentEditForm({
                                            amount: "",
                                            paymentMethod: "cash",
                                            transactionId: "",
                                            notes: "",
                                            paymentDate: "",
                                          });
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  // Display Payment
                                  <div className="flex flex-col space-y-3 px-4 py-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                      <div className="flex items-center space-x-3">
                                        <div className="px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                          {formatCurrency(pmt.amount)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {formatDate(pmt.paymentDate)}
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                          {pmt.paymentMethod || "N/A"}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                          <button
                                            onClick={() =>
                                              handlePaymentEdit(
                                                subscription._id,
                                                idx,
                                                pmt
                                              )
                                            }
                                            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded"
                                            title="Edit payment"
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              handlePaymentDelete(
                                                subscription._id,
                                                idx,
                                                pmt
                                              )
                                            }
                                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded"
                                            title="Delete payment"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    {(pmt.transactionId || pmt.notes) && (
                                      <div className="flex flex-col sm:flex-row gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                                        {pmt.transactionId && (
                                          <span>Txn: {pmt.transactionId}</span>
                                        )}
                                        {pmt.notes && (
                                          <span>Notes: {pmt.notes}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Payment Form */}
                  {isEditing && (
                    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Add Payment
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={paymentForm.amount}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              amount: e.target.value,
                            })
                          }
                          className="text-sm"
                        />
                        <select
                          value={paymentForm.paymentMethod}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              paymentMethod: e.target.value,
                            })
                          }
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        >
                          <option value="cash">Cash</option>
                          <option value="online">Online</option>
                          <option value="bank-transfer">Bank Transfer</option>
                          <option value="cheque">Cheque</option>
                          <option value="other">Other</option>
                        </select>
                        <Input
                          type="text"
                          placeholder="Transaction ID (optional)"
                          value={paymentForm.transactionId}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              transactionId: e.target.value,
                            })
                          }
                          className="text-sm"
                        />
                        <Input
                          type="text"
                          placeholder="Notes (optional)"
                          value={paymentForm.notes}
                          onChange={(e) =>
                            setPaymentForm({
                              ...paymentForm,
                              notes: e.target.value,
                            })
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handlePaymentSubmit(subscription._id)}
                          className="flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Add Payment</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSubscription(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {subscription.paymentStatus !== "paid" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setEditingSubscription(subscription._id)
                          }
                          className="flex items-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Payment</span>
                        </Button>
                      )}
                      {remainingAmount > 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(subscription._id)}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Mark as Paid</span>
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {formatDate(subscription.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;
