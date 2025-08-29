import React from "react";
import {
  BookOpen,
  Github,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-linear-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                  C-Matrix Learning
                </span>
                <div className="h-0.5 w-0 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-md">
              Advanced e-learning platform with productivity tools to enhance
              your study experience and accelerate your academic journey.
            </p>

            {/* Contact Information */}
            <div className="space-y-4 pt-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <div className="w-1 h-4 bg-linear-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                <span>Contact Us</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                    <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <a
                    href="mailto:ranjit.b.kumar@gmail.com"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1"
                  >
                    ranjit.b.kumar@gmail.com
                  </a>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors duration-200">
                    <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <a
                    href="tel:+919940208802"
                    className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 text-sm transition-all duration-200 hover:translate-x-1"
                  >
                    +91 9940208802
                  </a>
                </div>

                <div className="flex items-start space-x-3 group">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors duration-200">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <address className="text-gray-700 dark:text-gray-300 text-sm not-italic leading-relaxed group-hover:translate-x-1 transition-transform duration-200">
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
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <div className="w-1 h-4 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Courses", href: "/courses" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 text-sm transition-all duration-200 hover:translate-x-2 flex items-center space-x-2 group"
                  >
                    <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-indigo-500 dark:group-hover:bg-indigo-400 transition-colors duration-200"></div>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Social */}
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <div className="w-1 h-4 bg-linear-to-b from-teal-600 to-cyan-600 rounded-full"></div>
              <span>Support</span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "/help" },
                { name: "FAQ", href: "/faq" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((link, index) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 text-sm transition-all duration-200 hover:translate-x-2 flex items-center space-x-2 group"
                  >
                    <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full group-hover:bg-teal-500 dark:group-hover:bg-teal-400 transition-colors duration-200"></div>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <div className="w-1 h-4 bg-linear-to-b from-pink-600 to-rose-600 rounded-full"></div>
                <span>Connect</span>
              </h3>
              <div className="flex space-x-3">
                {[
                  {
                    Icon: Github,
                    href: "#",
                    color: "hover:text-gray-900 dark:hover:text-white",
                  },
                  { Icon: Twitter, href: "#", color: "hover:text-blue-500" },
                  {
                    Icon: Mail,
                    href: "mailto:ranjit.b.kumar@gmail.com",
                    color: "hover:text-red-500",
                  },
                ].map(({ Icon, href, color }, index) => (
                  <a
                    key={index}
                    href={href}
                    className={`p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-600 dark:text-gray-400 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-gray-200/25 dark:hover:shadow-gray-900/25 group`}
                  >
                    <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} C-Matrix Learning. All rights
              reserved.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>for learners</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
