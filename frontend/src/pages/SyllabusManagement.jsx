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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Syllabus Management
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Class Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Manage Syllabus
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Add and organize syllabus content for different classes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {classes.map((className) => (
                  <option key={className} value={className}>
                    Class {className}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => setShowAddSubject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>

          {/* Current Class Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Class {selectedClass} Syllabus
              </span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {subjects.length} subjects •{" "}
              {subjects.reduce(
                (total, [_, subject]) =>
                  total + (subject.chapters?.length || 0),
                0
              )}{" "}
              chapters
            </p>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No syllabus added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by adding subjects for Class {selectedClass}
            </p>
            <Button onClick={() => setShowAddSubject(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subjects.map(([subjectKey, subject]) => (
              <div
                key={subjectKey}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.chapters?.length || 0} chapters
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedSubject(subjectKey);
                        setShowAddChapter(true);
                      }}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Chapter
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {subject.chapters && subject.chapters.length > 0 ? (
                    <div className="space-y-3">
                      {subject.chapters.map((chapter) => (
                        <div
                          key={chapter.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {chapter.title}
                            </h4>
                            <button
                              onClick={() =>
                                handleDeleteChapter(subjectKey, chapter.id)
                              }
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {chapter.topics && chapter.topics.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Topics:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {chapter.topics.map((topic, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
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
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No chapters added yet
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Subject
              </h3>
              <button
                onClick={() => setShowAddSubject(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <Input
                label="Subject Name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g., Mathematics, Science, English"
                required
              />

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddSubject(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add New Chapter
              </h3>
              <button
                onClick={() => setShowAddChapter(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(([key, subject]) => (
                    <option key={key} value={key}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Chapter Title"
                value={newChapterData.title}
                onChange={(e) =>
                  setNewChapterData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="e.g., Number Systems"
                required
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  placeholder="e.g., Natural Numbers, Whole Numbers, Integers"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddChapter(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddChapter}
                  disabled={!newChapterData.title.trim() || !selectedSubject}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
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
