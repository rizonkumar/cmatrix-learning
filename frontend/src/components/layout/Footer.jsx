import React from "react";
import { BookOpen, Github, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                C-Matrix Learning
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Advanced e-learning platform with productivity tools to enhance
              your study experience.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Contact Us
              </h3>

              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <a
                    href="mailto:ranjit.b.kumar@gmail.com"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    ranjit.b.kumar@gmail.com
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <a
                    href="tel:+919940208802"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                  >
                    91 9940208802
                  </a>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <address className="text-gray-600 dark:text-gray-400 text-sm not-italic leading-relaxed">
                    3D 575 Sector 8, Markat Nagar,
                    <br />
                    behind Doctor Tonpe Road,
                    <br />
                    Cuttack, Odisha 753014
                  </address>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Connect
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="mailto:ranjit.b.kumar@gmail.com"
                  className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} C-Matrix Learning. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
