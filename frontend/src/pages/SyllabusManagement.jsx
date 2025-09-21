import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Trash2,
  GraduationCap,
  FileText,
  ArrowLeft,
  Save,
  X,
  AlertTriangle,
  RefreshCw,
  Power,
  PowerOff,
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { adminService } from "../services/adminService";

const SyllabusManagement = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("9th");
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterData, setNewChapterData] = useState({
    title: "",
    topics: "",
  });
  const [togglingSyllabusId, setTogglingSyllabusId] = useState(null);

  const classes = [
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
    "JEE Main",
    "JEE Advanced",
    "NEET",
  ];

  // API functions
  const fetchSyllabi = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getAllSyllabi();
      setSyllabi(response.data.data.syllabi || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch syllabi");
      console.error("Error fetching syllabi:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSyllabusActive = async (syllabusId) => {
    if (togglingSyllabusId) return; // Prevent multiple simultaneous toggles

    try {
      setTogglingSyllabusId(syllabusId);
      setError(null);

      const response = await adminService.toggleSyllabusActive(syllabusId);

      let updatedSyllabus = null;

      if (response.data && typeof response.data === "object") {
        if (response.data.data && response.data.data.syllabus) {
          updatedSyllabus = response.data.data.syllabus;
        }
      }

      if (!updatedSyllabus) {
        console.error(
          "Could not extract syllabus from response:",
          response.data
        );
        throw new Error(
          "Invalid response format - could not extract syllabus data"
        );
      }

      // Update the syllabi state with the toggled syllabus
      setSyllabi((prev) => {
        const newSyllabi = prev.map((syllabus) =>
          syllabus && syllabus._id === syllabusId ? updatedSyllabus : syllabus
        );
        return newSyllabi;
      });
    } catch (err) {
      console.error("Error toggling syllabus:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to toggle syllabus status";
      setError(errorMessage);

      setTimeout(() => setError(null), 3000);
    } finally {
      setTogglingSyllabusId(null);
    }
  };

  useEffect(() => {
    fetchSyllabi();
  }, [selectedClass]);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Get the syllabus ID for the selected class
      const selectedSyllabus = syllabi.find(
        (s) => s && s.classLevel === selectedClass
      );

      if (!selectedSyllabus || !selectedSyllabus._id) {
        throw new Error(
          "No syllabus found for the selected class. Please create one first."
        );
      }

      const response = await adminService.addSubjectToSyllabus(
        selectedSyllabus._id,
        {
          name: newSubjectName.trim(),
          chapters: [], // Empty chapters for now
        }
      );

      // Update the syllabi state with the new subject
      setSyllabi((prev) => {
        const newSyllabi = prev.map((syllabus) =>
          syllabus && syllabus._id === selectedSyllabus._id
            ? response.data.data.syllabus
            : syllabus
        );
        return newSyllabi;
      });

      setNewSubjectName("");
      setShowAddSubject(false);

      // Show success message
      setError(null);
      // You can add a success toast here if you have a toast system
    } catch (err) {
      console.error("Error adding subject:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to add subject";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async () => {
    if (!newChapterData.title.trim() || !selectedSubject) return;

    try {
      setLoading(true);
      setError(null);

      // Get the syllabus ID for the selected class
      const selectedSyllabus = syllabi.find(
        (s) => s && s.classLevel === selectedClass
      );

      if (!selectedSyllabus || !selectedSyllabus._id) {
        throw new Error("No syllabus found for the selected class.");
      }

      // Parse topics from comma-separated string
      const topicsArray = newChapterData.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic.length > 0);

      if (topicsArray.length === 0) {
        throw new Error("At least one topic is required");
      }

      const response = await adminService.addChapterToSubject(
        selectedSyllabus._id,
        selectedSubject,
        {
          title: newChapterData.title.trim(),
          topics: topicsArray,
          description: "", // Optional description
        }
      );

      // Update the syllabi state with the new chapter
      setSyllabi((prev) => {
        const newSyllabi = prev.map((syllabus) =>
          syllabus && syllabus._id === selectedSyllabus._id
            ? response.data.data.syllabus
            : syllabus
        );
        return newSyllabi;
      });

      setNewChapterData({ title: "", topics: "" });
      setShowAddChapter(false);
    } catch (err) {
      console.error("Error adding chapter:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to add chapter";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (subjectKey, chapter) => {
    setSelectedSubject(subjectKey);
    setSelectedChapter(chapter);
    setShowDeleteModal(true);
  };

  const handleDeleteChapter = async () => {
    if (!selectedChapter || !selectedSubject) return;

    try {
      setLoading(true);
      setError(null);

      // Get the syllabus ID for the selected class
      const selectedSyllabus = syllabi.find(
        (s) => s && s.classLevel === selectedClass
      );

      if (!selectedSyllabus || !selectedSyllabus._id) {
        throw new Error("No syllabus found for the selected class.");
      }

      const response = await adminService.deleteChapterFromSubject(
        selectedSyllabus._id,
        selectedSubject,
        selectedChapter.title
      );

      // Update the syllabi state after deletion
      setSyllabi((prev) => {
        const newSyllabi = prev.map((syllabus) =>
          syllabus && syllabus._id === selectedSyllabus._id
            ? response.data.data.syllabus
            : syllabus
        );
        return newSyllabi;
      });

      setShowDeleteModal(false);
      setSelectedChapter(null);
      setSelectedSubject("");
    } catch (err) {
      console.error("Error deleting chapter:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete chapter";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Get the syllabus for the selected class
  const selectedSyllabus = syllabi.find(
    (s) => s && s.classLevel === selectedClass
  );
  const subjects = selectedSyllabus?.subjects || [];

  // Fallback syllabus object for when none is selected
  const syllabusToUse = selectedSyllabus || {
    _id: null,
    isActive: false,
    title: "No syllabus found",
    description: "Please create a syllabus for this class",
    classLevel: selectedClass,
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-purple-600 dark:text-purple-400 animate-spin" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Syllabus Management
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
                Loading syllabi...
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Loading syllabi...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Syllabus Management
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
                Error loading syllabi
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
            Error Loading Syllabi
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-6">{error}</p>
          <Button
            onClick={fetchSyllabi}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white truncate">
              Syllabus Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Organize and manage course content
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center justify-center sm:justify-start space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-4 sm:px-6 py-3 w-fit cursor-pointer flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">
            Back to Dashboard
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        {/* Class Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Manage Syllabus
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Add and organize syllabus content for different classes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Select Class:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-600 cursor-pointer text-sm sm:text-base"
                >
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      {className.includes("JEE") || className === "NEET"
                        ? className
                        : `Class ${className}`}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => setShowAddSubject(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>

          {/* Current Class Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900 dark:text-purple-100 block truncate">
                    {selectedClass.includes("JEE") || selectedClass === "NEET"
                      ? `${selectedClass} Syllabus`
                      : `Class ${selectedClass} Syllabus`}
                  </span>
                  <p className="text-sm sm:text-base text-purple-700 dark:text-purple-300 mt-1">
                    Comprehensive course structure
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {subjects.length}
                </div>
                <div className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-medium">
                  Subjects
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">
                  Total Chapters:{" "}
                  {subjects.reduce(
                    (total, subject) => total + (subject.chapters?.length || 0),
                    0
                  )}
                </span>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      selectedSyllabus?.isActive
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`font-semibold ${
                      syllabusToUse?.isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {syllabusToUse?.isActive ? "Active" : "Inactive"}
                  </span>

                  {/* Toggle Switch */}
                  <div className="relative group">
                    <button
                      onClick={() =>
                        syllabusToUse && toggleSyllabusActive(syllabusToUse._id)
                      }
                      disabled={
                        togglingSyllabusId === syllabusToUse?._id ||
                        !syllabusToUse ||
                        !syllabusToUse._id
                      }
                      className={`
                        relative inline-flex items-center h-10 w-20 rounded-full transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800
                        ${
                          syllabusToUse?.isActive
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                        }
                        ${
                          togglingSyllabusId === syllabusToUse?._id ||
                          !syllabusToUse ||
                          !syllabusToUse._id
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      `}
                      title={
                        syllabusToUse?.isActive
                          ? "Click to deactivate this syllabus"
                          : "Click to activate this syllabus"
                      }
                    >
                      {/* Toggle Circle */}
                      <span
                        className={`
                          w-8 h-8 rounded-full bg-white shadow-lg transform transition-all duration-300 ease-in-out
                          flex items-center justify-center
                          ${
                            syllabusToUse?.isActive
                              ? "translate-x-10"
                              : "translate-x-1"
                          }
                        `}
                      >
                        {togglingSyllabusId === syllabusToUse?._id ? (
                          <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />
                        ) : syllabusToUse?.isActive ? (
                          <PowerOff className="w-4 h-4 text-green-600" />
                        ) : (
                          <Power className="w-4 h-4 text-gray-500" />
                        )}
                      </span>

                      {/* Hover Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                          {syllabusToUse?.isActive
                            ? "Deactivate syllabus"
                            : "Activate syllabus"}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 lg:p-12 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-600" />
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              No subjects added yet
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed px-4">
              Start building your curriculum by adding subjects for{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {selectedClass.includes("JEE") || selectedClass === "NEET"
                  ? selectedClass
                  : `Class ${selectedClass}`}
              </span>
            </p>
            <Button
              onClick={() => setShowAddSubject(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
              Add First Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {subjects.map((subject, index) => (
              <div
                key={subject.name || index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 group cursor-pointer overflow-hidden"
              >
                <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                          {subject.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-semibold">
                          {subject.chapters?.length || 0} chapters
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubject(subject.name);
                        setShowAddChapter(true);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-sm sm:text-base w-full lg:w-auto"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Add Chapter
                    </Button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                  {subject.chapters && subject.chapters.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter._id || chapter.title}
                          className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white min-w-0 flex-1">
                              {chapter.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(subject.name, chapter);
                              }}
                              className="p-2 sm:p-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
                              title="Delete Chapter"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>

                          {chapter.topics && chapter.topics.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Topics:
                              </p>
                              <div className="flex flex-wrap gap-2 sm:gap-3">
                                {chapter.topics.map((topic, index) => (
                                  <span
                                    key={topic._id || index}
                                    className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-xs sm:text-sm text-purple-800 dark:text-purple-200 rounded-xl font-semibold border border-purple-200 dark:border-purple-700"
                                  >
                                    {topic.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12 lg:py-16 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-xl transition-colors duration-200">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                      </div>
                      <p className="text-base sm:text-lg lg:text-xl text-gray-500 dark:text-gray-400 font-semibold mb-2">
                        No chapters added yet
                      </p>
                      <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500">
                        Click{" "}
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          "Add Chapter"
                        </span>{" "}
                        to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700 mx-4 sm:mx-auto">
            <div className="flex items-center justify-between p-4 sm:p-8 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    Add New Subject
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a new subject for{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {selectedClass.includes("JEE") || selectedClass === "NEET"
                        ? selectedClass
                        : `Class ${selectedClass}`}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSubject(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
                disabled={loading}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-8">
              <div className="space-y-6">
                <Input
                  label="Subject Name"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Mathematics, Science, English, History"
                  required
                  disabled={loading}
                  className="text-base sm:text-lg"
                />

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAddSubject(false)}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 cursor-pointer order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim() || loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer order-1 sm:order-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {loading ? "Adding..." : "Add Subject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 mx-4 sm:mx-auto">
            <div className="flex items-center justify-between p-4 sm:p-8 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    Add New Chapter
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add a chapter to the selected subject
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddChapter(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
                disabled={loading}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.name} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Input
                      label="Chapter Title"
                      value={newChapterData.title}
                      onChange={(e) =>
                        setNewChapterData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="e.g., Number Systems, Algebra"
                      required
                      disabled={loading}
                      className="text-base sm:text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Topics (comma-separated)
                  </label>
                  <textarea
                    value={newChapterData.topics}
                    onChange={(e) =>
                      setNewChapterData((prev) => ({
                        ...prev,
                        topics: e.target.value,
                      }))
                    }
                    placeholder="e.g., Natural Numbers, Whole Numbers, Integers, Rational Numbers"
                    disabled={loading}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none hover:bg-gray-50 dark:hover:bg-gray-600 cursor-text disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Separate each topic with a comma
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAddChapter(false)}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 cursor-pointer order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddChapter}
                  disabled={
                    !newChapterData.title.trim() || !selectedSubject || loading
                  }
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer order-1 sm:order-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {loading ? "Adding..." : "Add Chapter"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedChapter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 mx-4 sm:mx-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    Delete Chapter
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedChapter(null);
                  setSelectedSubject("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer flex-shrink-0"
                disabled={loading}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {selectedChapter.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this chapter? All associated
                  topics will be permanently removed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedChapter(null);
                    setSelectedSubject("");
                  }}
                  disabled={loading}
                  className="px-4 sm:px-6 py-3 cursor-pointer order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteChapter}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 sm:px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer order-1 sm:order-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5 mr-2" />
                  )}
                  {loading ? "Deleting..." : "Delete Chapter"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusManagement;
