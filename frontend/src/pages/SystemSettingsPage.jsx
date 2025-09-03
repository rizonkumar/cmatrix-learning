import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  ArrowLeft,
  Save,
  Shield,
  Mail,
  Database,
  Bell,
  Palette,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { toast } from "react-hot-toast";
import adminService from "../services/adminService";

const SystemSettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(null);

  const [showPasswords, setShowPasswords] = useState({
    smtpPassword: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getSystemSettings();
      setSettings(response.data.settings);
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load system settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await adminService.updateSystemSettings(settings);
      toast.success("System settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save system settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const testEmailSettings = async () => {
    try {
      setLoading(true);
      await adminService.testEmailSettings(settings.email);
      toast.success("Email settings tested successfully!");
    } catch (error) {
      console.error("Email test failed:", error);
      toast.error("Email test failed");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Shield },
    { id: "email", label: "Email", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "database", label: "Database", icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Site Name"
                value={settings.general.siteName}
                onChange={(e) =>
                  handleInputChange("general", "siteName", e.target.value)
                }
                placeholder="Enter site name"
              />

              <Input
                label="Contact Email"
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) =>
                  handleInputChange("general", "contactEmail", e.target.value)
                }
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                value={settings.general.siteDescription}
                onChange={(e) =>
                  handleInputChange(
                    "general",
                    "siteDescription",
                    e.target.value
                  )
                }
                placeholder="Enter site description"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Support Email"
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) =>
                  handleInputChange("general", "supportEmail", e.target.value)
                }
                placeholder="support@example.com"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.general.timezone}
                  onChange={(e) =>
                    handleInputChange("general", "timezone", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">
                    America/New_York (EST)
                  </option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.general.maintenanceMode}
                onChange={(e) =>
                  handleInputChange(
                    "general",
                    "maintenanceMode",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="maintenanceMode"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Maintenance Mode
              </label>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "sessionTimeout",
                    e.target.value
                  )
                }
                placeholder="30"
              />

              <Input
                label="Minimum Password Length"
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "passwordMinLength",
                    e.target.value
                  )
                }
                placeholder="8"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Max Login Attempts"
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) =>
                  handleInputChange(
                    "security",
                    "maxLoginAttempts",
                    e.target.value
                  )
                }
                placeholder="5"
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  IP Whitelist (comma-separated)
                </label>
                <textarea
                  value={settings.security.ipWhitelist}
                  onChange={(e) =>
                    handleInputChange("security", "ipWhitelist", e.target.value)
                  }
                  placeholder="192.168.1.1, 10.0.0.1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "twoFactorAuth",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="twoFactorAuth"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable Two-Factor Authentication
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="bruteForceProtection"
                  checked={settings.security.bruteForceProtection}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "bruteForceProtection",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="bruteForceProtection"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable Brute Force Protection
                </label>
              </div>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="SMTP Host"
                value={settings.email.smtpHost}
                onChange={(e) =>
                  handleInputChange("email", "smtpHost", e.target.value)
                }
                placeholder="smtp.gmail.com"
              />

              <Input
                label="SMTP Port"
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) =>
                  handleInputChange("email", "smtpPort", e.target.value)
                }
                placeholder="587"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="SMTP Username"
                value={settings.email.smtpUser}
                onChange={(e) =>
                  handleInputChange("email", "smtpUser", e.target.value)
                }
                placeholder="your-email@gmail.com"
              />

              <div className="relative">
                <Input
                  label="SMTP Password"
                  type={showPasswords.smtpPassword ? "text" : "password"}
                  value={settings.email.smtpPassword}
                  onChange={(e) =>
                    handleInputChange("email", "smtpPassword", e.target.value)
                  }
                  placeholder="Your SMTP password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("smtpPassword")}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.smtpPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="From Email"
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) =>
                  handleInputChange("email", "fromEmail", e.target.value)
                }
                placeholder="noreply@example.com"
              />

              <Input
                label="From Name"
                value={settings.email.fromName}
                onChange={(e) =>
                  handleInputChange("email", "fromName", e.target.value)
                }
                placeholder="Your App Name"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={testEmailSettings}
                variant="outline"
                className="px-6 py-3"
              >
                Test Email Settings
              </Button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "emailNotifications",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Push Notifications
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send browser push notifications
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "pushNotifications",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    SMS Notifications
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send notifications via SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "smsNotifications",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Weekly Reports
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send weekly analytics reports
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReports}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "weeklyReports",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Course Updates
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Notify about course updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.courseUpdates}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "courseUpdates",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    System Alerts
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send system status alerts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.systemAlerts}
                  onChange={(e) =>
                    handleInputChange(
                      "notifications",
                      "systemAlerts",
                      e.target.checked
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) =>
                      handleInputChange(
                        "appearance",
                        "primaryColor",
                        e.target.value
                      )
                    }
                    className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={settings.appearance.primaryColor}
                    onChange={(e) =>
                      handleInputChange(
                        "appearance",
                        "primaryColor",
                        e.target.value
                      )
                    }
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.appearance.secondaryColor}
                    onChange={(e) =>
                      handleInputChange(
                        "appearance",
                        "secondaryColor",
                        e.target.value
                      )
                    }
                    className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={settings.appearance.secondaryColor}
                    onChange={(e) =>
                      handleInputChange(
                        "appearance",
                        "secondaryColor",
                        e.target.value
                      )
                    }
                    placeholder="#6366F1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Logo URL"
                value={settings.appearance.logoUrl}
                onChange={(e) =>
                  handleInputChange("appearance", "logoUrl", e.target.value)
                }
                placeholder="https://example.com/logo.png"
              />

              <Input
                label="Favicon URL"
                value={settings.appearance.faviconUrl}
                onChange={(e) =>
                  handleInputChange("appearance", "faviconUrl", e.target.value)
                }
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="darkModeDefault"
                checked={settings.appearance.darkModeDefault}
                onChange={(e) =>
                  handleInputChange(
                    "appearance",
                    "darkModeDefault",
                    e.target.checked
                  )
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="darkModeDefault"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Enable Dark Mode by Default
              </label>
            </div>
          </div>
        );

      case "database":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.database.backupFrequency}
                  onChange={(e) =>
                    handleInputChange(
                      "database",
                      "backupFrequency",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <Input
                label="Retention Period (days)"
                type="number"
                value={settings.database.retentionPeriod}
                onChange={(e) =>
                  handleInputChange(
                    "database",
                    "retentionPeriod",
                    e.target.value
                  )
                }
                placeholder="30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Max Connections"
                type="number"
                value={settings.database.maxConnections}
                onChange={(e) =>
                  handleInputChange(
                    "database",
                    "maxConnections",
                    e.target.value
                  )
                }
                placeholder="100"
              />

              <div className="flex items-center space-x-3 pt-8">
                <input
                  type="checkbox"
                  id="autoOptimize"
                  checked={settings.database.autoOptimize}
                  onChange={(e) =>
                    handleInputChange(
                      "database",
                      "autoOptimize",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="autoOptimize"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable Auto Optimization
                </label>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Database Settings Notice
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Changes to database settings may require a system restart.
                    Please ensure you have a recent backup before making
                    changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900/30 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              System Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure platform settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {settings ? (
            <>
              {renderTabContent()}

              {/* Save Button */}
              <div className="flex justify-end pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading system settings...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
