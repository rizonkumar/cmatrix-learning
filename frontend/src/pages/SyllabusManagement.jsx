import React, { useState } from "react";
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
} from "lucide-react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

// Mock syllabus data structure
const initialSyllabusData = {
  "8th": {
    subjects: {
      mathematics: {
        name: "Mathematics",
        chapters: [
          {
            id: 1,
            title: "Number Systems",
            topics: [
              "Natural Numbers",
              "Whole Numbers",
              "Integers",
              "Rational Numbers",
            ],
          },
          {
            id: 2,
            title: "Algebra",
            topics: [
              "Expressions",
              "Equations",
              "Linear Equations",
              "Polynomials",
            ],
          },
        ],
      },
      science: {
        name: "Science",
        chapters: [
          {
            id: 1,
            title: "Crop Production and Management",
            topics: [
              "Agriculture",
              "Irrigation",
              "Crop Protection",
              "Animal Husbandry",
            ],
          },
          {
            id: 2,
            title: "Microorganisms",
            topics: ["Bacteria", "Fungi", "Protozoa", "Viruses"],
          },
        ],
      },
    },
  },
  "9th": {
    subjects: {
      mathematics: {
        name: "Mathematics",
        chapters: [
          {
            id: 1,
            title: "Number Systems",
            topics: [
              "Real Numbers",
              "Irrational Numbers",
              "Real Numbers and their Decimal Expansions",
            ],
          },
          {
            id: 2,
            title: "Polynomials",
            topics: [
              "Introduction",
              "Zeros of a Polynomial",
              "Remainder Theorem",
              "Factor Theorem",
            ],
          },
        ],
      },
      science: {
        name: "Science",
        chapters: [
          {
            id: 1,
            title: "Matter in Our Surroundings",
            topics: [
              "Physical Nature of Matter",
              "Characteristics of Particles of Matter",
              "States of Matter",
            ],
          },
          {
            id: 2,
            title: "Is Matter Around Us Pure?",
            topics: [
              "Mixtures",
              "Solutions",
              "Separating the Components of a Mixture",
            ],
          },
        ],
      },
    },
  },
};

const SyllabusManagement = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("8th");
  const [syllabusData, setSyllabusData] = useState(initialSyllabusData);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterData, setNewChapterData] = useState({
    title: "",
    topics: "",
  });

  const classes = ["8th", "9th", "10th", "11th", "12th"];

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;

    const subjectKey = newSubjectName.toLowerCase().replace(/\s+/g, "");
    const updatedData = { ...syllabusData };

    if (!updatedData[selectedClass]) {
      updatedData[selectedClass] = { subjects: {} };
    }
    if (!updatedData[selectedClass].subjects) {
      updatedData[selectedClass].subjects = {};
    }

    updatedData[selectedClass].subjects[subjectKey] = {
      name: newSubjectName,
      chapters: [],
    };

    setSyllabusData(updatedData);
    setNewSubjectName("");
    setShowAddSubject(false);

    // Show success message
    console.log(
      `Added new subject: ${newSubjectName} for Class ${selectedClass}`
    );
  };

  const handleAddChapter = () => {
    if (!newChapterData.title.trim() || !selectedSubject) return;

    const updatedData = { ...syllabusData };
    const topics = newChapterData.topics
      .split(",")
      .map((topic) => topic.trim())
      .filter((topic) => topic);

    const newChapter = {
      id: Date.now(),
      title: newChapterData.title,
      topics: topics,
    };

    if (!updatedData[selectedClass].subjects[selectedSubject].chapters) {
      updatedData[selectedClass].subjects[selectedSubject].chapters = [];
    }

    updatedData[selectedClass].subjects[selectedSubject].chapters.push(
      newChapter
    );
    setSyllabusData(updatedData);

    setNewChapterData({ title: "", topics: "" });
    setShowAddChapter(false);

    console.log(
      `Added new chapter: ${newChapterData.title} to ${selectedSubject}`
    );
  };

  const handleDeleteChapter = (subjectKey, chapterId) => {
    const updatedData = { ...syllabusData };
    updatedData[selectedClass].subjects[subjectKey].chapters = updatedData[
      selectedClass
    ].subjects[subjectKey].chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    setSyllabusData(updatedData);
    console.log(`Deleted chapter with ID: ${chapterId}`);
  };

  const currentClassData = syllabusData[selectedClass] || { subjects: {} };
  const subjects = Object.entries(currentClassData.subjects || {});

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-4 py-2 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Syllabus Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Organize and manage course content
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        {/* Class Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Manage Syllabus
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Add and organize syllabus content for different classes
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Class:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {classes.map((className) => (
                    <option key={className} value={className}>
                      Class {className}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => setShowAddSubject(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>

          {/* Current Class Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <span className="text-xl font-bold text-blue-900 dark:text-blue-100">
                    Class {selectedClass} Syllabus
                  </span>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Comprehensive course structure
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {subjects.length}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Subjects
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Total Chapters:{" "}
                  {subjects.reduce(
                    (total, [, subject]) =>
                      total + (subject.chapters?.length || 0),
                    0
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No syllabus added yet
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Start building your curriculum by adding subjects for Class{" "}
              {selectedClass}
            </p>
            <Button
              onClick={() => setShowAddSubject(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {subjects.map(([subjectKey, subject]) => (
              <div
                key={subjectKey}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {subject.chapters?.length || 0} chapters
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedSubject(subjectKey);
                        setShowAddChapter(true);
                      }}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Chapter
                    </Button>
                  </div>
                </div>

                <div className="p-8">
                  {subject.chapters && subject.chapters.length > 0 ? (
                    <div className="space-y-4">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {chapter.title}
                            </h4>
                            <button
                              onClick={() =>
                                handleDeleteChapter(subjectKey, chapter.id)
                              }
                              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                              title="Delete Chapter"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {chapter.topics && chapter.topics.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Topics:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {chapter.topics.map((topic, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 text-sm text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
                        No chapters added yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Click "Add Chapter" to get started
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Subject
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Create a new subject for Class {selectedClass}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddSubject(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <Input
                label="Subject Name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g., Mathematics, Science, English, History"
                required
                className="text-lg"
              />

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAddSubject(false)}
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Chapter
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add a chapter to the selected subject
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddChapter(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(([key, subject]) => (
                      <option key={key} value={key}>
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
                    className="text-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Separate each topic with a comma
                </p>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setShowAddChapter(false)}
                  className="px-6 py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddChapter}
                  disabled={!newChapterData.title.trim() || !selectedSubject}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Add Chapter
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
