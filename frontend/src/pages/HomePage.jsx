import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  Zap,
  Target,
  Sparkles,
  Clock,
  Shield,
  Heart,
  Quote,
} from "lucide-react";
import Button from "../components/common/Button";
import CourseCard from "../components/CourseCard";
import { courseService } from "../services/courseService";
import { enrollmentService } from "../services/enrollmentService";
import { DataLoader } from "../components/common/LoadingSpinner";
import { CourseCardSkeleton } from "../components/common/SkeletonLoader";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [featuredResponse, enrolledResponse] = await Promise.all([
        courseService.getCourses({ limit: 3, featured: true }),
        enrollmentService
          .getMyEnrollments({ limit: 100 })
          .catch(() => ({ data: [] })), // Gracefully handle if not logged in
      ]);

      setFeaturedCourses(featuredResponse.data.courses || []);

      const enrolledSet = new Set(
        enrolledResponse.data?.map((enrollment) => enrollment.course._id) || []
      );
      setEnrolledCourses(enrolledSet);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading homepage data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnroll = async (course) => {
    try {
      await enrollmentService.enrollInCourse(course._id || course.id);
      setEnrolledCourses((prev) => new Set([...prev, course._id || course.id]));
      toast.success(`Successfully enrolled in ${course.title}!`);
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll in course. Please try again.");
    }
  };

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "IIT-JEE Aspirant",
      content:
        "C-Matrix Learning transformed my preparation. The streak system kept me motivated daily!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      name: "Priya Patel",
      role: "NEET Student",
      content:
        "Amazing platform with comprehensive content. The dark mode is a lifesaver for late-night studying.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
    },
    {
      name: "Arjun Kumar",
      role: "Class 12 Student",
      content:
        "The productivity tools and kanban board help me stay organized. Highly recommended!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Courses",
      description:
        "Access thousands of high-quality courses across multiple subjects and difficulty levels.",
      color: "blue",
    },
    {
      icon: Award,
      title: "Learning Streaks",
      description:
        "Stay motivated with our streak system that rewards consistent learning habits.",
      color: "green",
    },
    {
      icon: Users,
      title: "Community Support",
      description:
        "Join a vibrant community of learners and get support from instructors and peers.",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Smart Learning",
      description:
        "AI-powered recommendations and adaptive learning paths tailored to your progress.",
      color: "yellow",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description:
        "Set and track your learning goals with detailed progress analytics.",
      color: "red",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-grade security and privacy measures.",
      color: "indigo",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                #1 Learning Platform in India
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                Master Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Learning Journey
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Advanced e-learning platform with AI-powered productivity tools
                designed to boost your academic success.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/courses">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <BookOpen className="mr-2 w-5 h-5" />
                    Explore Courses
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 backdrop-blur-sm bg-white/10"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Start Learning Free
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10,000+</div>
                  <div className="text-blue-100 text-sm">Happy Students</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-blue-100 text-sm">
                    Expert Instructors
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">1,200+</div>
                  <div className="text-blue-100 text-sm">Quality Courses</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Visual */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
                <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="font-semibold">Your Progress</span>
                    </div>
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                      Day 7
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Physics Fundamentals</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mathematics Advanced</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-300" />
                      <span className="text-sm">Keep it up! 🔥</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 animate-bounce">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 animate-pulse">
                <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Excel Academically
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with proven learning
              methodologies to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
                green:
                  "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
                purple:
                  "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
                yellow:
                  "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
                red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
                indigo:
                  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
              };

              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-16 h-16 ${
                      colorClasses[feature.color]
                    } rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Start your learning journey in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 -z-10"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Choose Your Course
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our extensive collection of courses and select the ones
                that match your learning goals.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500 to-teal-600 -z-10"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Learn at Your Pace
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access video lectures, quizzes, and interactive content. Track
                your progress with our dashboard.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Achieve Success
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build learning streaks, earn certificates, and track your
                academic achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Hear from students who transformed their learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-blue-500 mr-2" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Featured Courses
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your Learning Journey Today
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our most popular courses designed to accelerate your
              academic success
            </p>
          </div>

          <div className="mb-12">
            <DataLoader
              loading={loading && featuredCourses.length === 0}
              error={error}
              onRetry={loadData}
              emptyMessage="No featured courses available"
            >
              {featuredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredCourses.map((course) => (
                    <CourseCard
                      key={course._id || course.id}
                      course={course}
                      isEnrolled={enrolledCourses.has(course._id || course.id)}
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
              ) : !loading && !error ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No featured courses available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Check back later for our featured courses.
                  </p>
                </div>
              ) : null}
            </DataLoader>

            {/* Loading skeletons */}
            {loading && featuredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {[...Array(3)].map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <Link to="/courses">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Explore All Courses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Thousands of Students
            </h2>
            <p className="text-xl text-blue-100">
              Join our growing community of successful learners
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">
                  10,000+
                </div>
                <div className="text-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Active Students
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-blue-100 flex items-center justify-center">
                  <Award className="w-4 h-4 mr-2" />
                  Expert Instructors
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">1,200+</div>
                <div className="text-blue-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Quality Courses
                </div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10"></div>

            <div className="relative">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Start?
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Transform Your Learning
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Experience Today
                </span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already achieving their
                academic goals with C-Matrix Learning. Start your journey
                towards academic excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
                  >
                    <Heart className="mr-2 w-5 h-5" />
                    Sign In to Continue
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-blue-500 mr-2" />
                  30-day money-back guarantee
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-purple-500 mr-2" />
                  Learn at your own pace
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
