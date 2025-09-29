import React from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Eye,
  Database,
  Shield,
  Cookie,
  UserCheck,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full blur-3xl"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full border border-primary/20">
                <Lock className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-3 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <p className="text-sm text-primary font-medium">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-10 space-y-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/3 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          {/* Introduction */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  1. Information We Collect
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                At C-Matrix Learning, we are committed to protecting your
                privacy. This Privacy Policy explains how we collect, use, and
                safeguard your personal information when you use our educational
                platform.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-primary" />
                    Personal Information
                  </h3>
                  <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                      Name and contact information
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                      Educational background and preferences
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                      Profile picture and bio
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    Usage Data
                  </h3>
                  <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                      Learning progress and course completion
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                      Interaction with platform features
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500 mt-0.5 flex-shrink-0" />
                      Performance analytics and assessments
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Section Divider */}
            <div className="mt-8 mb-6">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-600 to-transparent"></div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  2. How We Use Your Information
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-500/50 rounded-full"></div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <div className="grid gap-4">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Educational Services
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    Personalize your learning experience, track progress, and
                    provide tailored recommendations
                  </p>
                </div>
                <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Platform Improvement
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    Analyze usage patterns to enhance our services and develop
                    new features
                  </p>
                </div>
                <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Communication
                  </h3>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    Send important updates, course notifications, and respond to
                    your inquiries
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="space-y-3 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>With Your Consent:</strong> When you explicitly
                    authorize us to share information
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Service Providers:</strong> With trusted partners
                    who help us operate our platform (under strict
                    confidentiality agreements)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Legal Requirements:</strong> When required by law or
                    to protect our rights and safety
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    <strong>Business Transfers:</strong> In case of merger,
                    acquisition, or sale of assets
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              4. Data Security
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                We implement robust security measures to protect your personal
                information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      SSL/TLS encryption for data transmission
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Secure data storage with access controls
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Regular security audits and updates
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Employee access restrictions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Incident response procedures
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Data backup and recovery systems
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-warning-800 dark:text-warning-200 font-medium">
                      Security Limitations
                    </p>
                    <p className="text-warning-700 dark:text-warning-300 text-sm mt-1">
                      While we strive to protect your personal information, no
                      method of transmission over the internet or electronic
                      storage is 100% secure. We cannot guarantee absolute
                      security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-3">
              <Cookie className="w-6 h-6 text-primary" />
              5. Cookies and Tracking Technologies
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your
                experience:
              </p>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic
                  platform functionality
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how you
                  use our platform
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to show relevant
                  content and advertisements
                </li>
              </ul>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                You can control cookie settings through your browser
                preferences. However, disabling certain cookies may affect
                platform functionality.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              6. Data Retention
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                Privacy Policy. We may retain certain information for longer
                periods for legal, regulatory, or legitimate business purposes.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              7. Your Privacy Rights
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                You have the following rights regarding your personal
                information:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Access
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Request information about the personal data we hold about
                      you
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Correction
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Request correction of inaccurate or incomplete information
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Deletion
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Request deletion of your personal information (subject to
                      legal requirements)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Portability
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Request a copy of your data in a structured format
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Opt-out
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Withdraw consent for certain data processing activities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              8. Children's Privacy
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Our platform is designed for users aged 13 and above. We do not
                knowingly collect personal information from children under 13.
                If we become aware that we have collected personal information
                from a child under 13, we will take steps to delete such
                information.
              </p>
            </div>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              9. International Data Transfers
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              10. Changes to This Privacy Policy
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new Privacy
                Policy on this page and updating the "Last updated" date. Your
                continued use of our platform after such changes constitutes
                acceptance of the updated Privacy Policy.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              11. Contact Us
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our
                privacy practices, please contact us:
              </p>
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        Email
                      </p>
                      <p className="text-neutral-700 dark:text-neutral-300">
                        ranjit.b.kumar@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-success-500/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        Phone
                      </p>
                      <p className="text-neutral-700 dark:text-neutral-300">
                        +91 9940208802
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-warning-500/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-warning-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        Address
                      </p>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        3D 575 Sector 8, Markat Nagar,
                        <br />
                        behind Doctor Tonpe Road,
                        <br />
                        Cuttack, Odisha 753014
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <div className="bg-gradient-to-r from-primary/5 to-primary/3 rounded-2xl p-6 border border-primary/10">
            <p className="text-neutral-700 dark:text-neutral-300 font-medium">
              By using C-Matrix Learning, you acknowledge that you have read,
              understood, and agree to the collection and use of information as
              described in this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
