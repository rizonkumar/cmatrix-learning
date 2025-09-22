import React, { useState, useEffect } from "react";
import {
  X,
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
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "cash",
    transactionId: "",
    notes: "",
  });

  // Load user's subscription details
  useEffect(() => {
    const loadSubscriptionDetails = async () => {
      try {
        setLoading(true);
        const response = await paymentService.getUserSubscriptionDetails(
          user._id
        );
        setSubscriptions(response.data.subscriptions || []);
      } catch (err) {
        console.error("Error loading subscription details:", err);
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
      onUpdate();
    } catch (err) {
      console.error("Error updating pending amount:", err);
      alert(err.response?.data?.message || "Failed to update pending amount");
    }
  };

  if (loading) {
    return (
      <Modal onClose={onClose}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.fullName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.username} • {user.email}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Subscription Cards */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Subscriptions ({subscriptions.length})</span>
            </h3>

            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No subscriptions found for this user.
              </div>
            ) : (
              subscriptions.map((subscription) => {
                const statusInfo = getStatusInfo(subscription.paymentStatus);
                const isEditing = editingSubscription === subscription._id;
                const totalPaid = subscription.getTotalPaidAmount();
                const remainingAmount = subscription.amount - totalPaid;

                return (
                  <div
                    key={subscription._id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    {/* Subscription Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bg}`}
                        >
                          <statusInfo.icon
                            className={`w-5 h-5 ${statusInfo.color}`}
                          />
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {subscription.courseName || "Course Not Specified"}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span
                              className={`px-2 py-1 rounded-full ${getSubscriptionTypeColor(
                                subscription.subscriptionType
                              )}`}
                            >
                              {subscription.subscriptionType?.replace("-", " ")}
                            </span>
                            <div className="flex items-center space-x-1">
                              <GraduationCap className="w-3 h-3" />
                              <span>{subscription.classLevel || "N/A"}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{subscription.subject || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(subscription.amount)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
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
                            width: `${
                              (totalPaid / subscription.amount) * 100
                            }%`,
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
                            onClick={() =>
                              handlePaymentSubmit(subscription._id)
                            }
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
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;
