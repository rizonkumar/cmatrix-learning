import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  FileText,
  Users,
  BookOpen,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const TermsOfServicePage = () => {
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
                <Shield className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-3 max-w-2xl mx-auto">
              Please read these terms carefully before using C-Matrix Learning
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
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  1. Acceptance of Terms
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Welcome to C-Matrix Learning ("we," "our," or "us"). By
                accessing or using our educational platform, you agree to be
                bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, please do not use our services.
              </p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                These Terms constitute a legally binding agreement between you
                and C-Matrix Learning. We may modify these Terms at any time,
                and your continued use of the platform constitutes acceptance of
                the modified Terms.
              </p>
            </div>
            {/* Section Divider */}
            <div className="mt-8 mb-6">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-600 to-transparent"></div>
            </div>
          </section>

          {/* Services */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500/10 to-success-500/5 rounded-xl flex items-center justify-center border border-success-500/20">
                <BookOpen className="w-6 h-6 text-success-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  2. Services Provided
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-success-500 to-success-500/50 rounded-full"></div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                C-Matrix Learning provides an online educational platform
                offering:
              </p>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  Access to educational courses and learning materials
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  Interactive learning tools and progress tracking
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  Community features for student interaction
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  Productivity tools including task management and learning
                  streaks
                </li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  3. User Accounts and Registration
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-500/50 rounded-full"></div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                To access our services, you must:
              </p>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 mb-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Be responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-warning-800 dark:text-warning-200 font-medium">
                      Account Responsibility
                    </p>
                    <p className="text-warning-700 dark:text-warning-300 text-sm mt-1">
                      You are solely responsible for maintaining the security of
                      your account and password. C-Matrix Learning will not be
                      liable for any loss or damage from your failure to comply
                      with this security obligation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl flex items-center justify-center border border-green-500/20">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  4. Payment and Subscription Terms
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-green-500/50 rounded-full"></div>
              </div>
            </div>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                Payment terms for our services:
              </p>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>Price changes will be communicated 30 days in advance</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              5. User Conduct
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                <li>
                  Use the platform for any illegal or unauthorized purpose
                </li>
                <li>
                  Share, distribute, or reproduce copyrighted content without
                  permission
                </li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>
                  Use automated tools to access the platform without permission
                </li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              6. Intellectual Property
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                All content, features, and functionality of C-Matrix Learning
                are owned by us and are protected by copyright, trademark, and
                other intellectual property laws. You may not reproduce,
                distribute, or create derivative works without our express
                written consent.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              7. Disclaimers
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Our platform is provided "as is" without warranties of any kind.
                We do not guarantee that the service will be uninterrupted or
                error-free. We are not responsible for any damages arising from
                your use of the platform.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              8. Limitation of Liability
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                To the maximum extent permitted by law, C-Matrix Learning shall
                not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of our
                services.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              9. Termination
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                We may terminate or suspend your account at our sole discretion,
                without prior notice, for conduct that we believe violates these
                Terms or is harmful to other users or our platform.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              10. Governing Law
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with applicable laws. Any disputes arising from these Terms
                shall be resolved through binding arbitration.
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
                If you have any questions about these Terms of Service, please
                contact us:
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
              understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
