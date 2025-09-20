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
  "JEE Main": {
    subjects: {
      physics: {
        name: "Physics",
        chapters: [
          {
            id: 1,
            title: "Units and Measurements",
            topics: [
              "Physical quantities and their units",
              "Dimensional analysis",
              "Significant figures",
              "Error analysis",
            ],
          },
          {
            id: 2,
            title: "Kinematics",
            topics: [
              "Motion in a straight line",
              "Motion in a plane",
              "Projectile motion",
              "Relative velocity",
              "Circular motion",
            ],
          },
          {
            id: 3,
            title: "Laws of Motion",
            topics: [
              "Newton's laws of motion",
              "Friction",
              "Dynamics of rigid bodies",
              "Conservation of momentum",
            ],
          },
          {
            id: 4,
            title: "Work, Energy and Power",
            topics: [
              "Work done by constant force",
              "Work-energy theorem",
              "Power",
              "Conservative and non-conservative forces",
              "Potential energy",
            ],
          },
          {
            id: 5,
            title: "Rotational Motion",
            topics: [
              "Moment of inertia",
              "Torque",
              "Angular momentum",
              "Rolling motion",
            ],
          },
        ],
      },
      chemistry: {
        name: "Chemistry",
        chapters: [
          {
            id: 1,
            title: "Some Basic Concepts of Chemistry",
            topics: [
              "Matter and its nature",
              "Dalton's atomic theory",
              "Mole concept and molar mass",
              "Percentage composition",
              "Empirical and molecular formula",
            ],
          },
          {
            id: 2,
            title: "States of Matter",
            topics: [
              "Gas laws",
              "Kinetic theory of gases",
              "Deviation from ideal behavior",
              "Liquefaction of gases",
              "Solid state",
            ],
          },
          {
            id: 3,
            title: "Atomic Structure",
            topics: [
              "Bohr's model",
              "Quantum mechanical model",
              "Electronic configuration",
              "Periodic table",
              "Chemical bonding",
            ],
          },
        ],
      },
      mathematics: {
        name: "Mathematics",
        chapters: [
          {
            id: 1,
            title: "Sets, Relations and Functions",
            topics: [
              "Sets and their representations",
              "Union, intersection and complement",
              "Types of relations",
              "Equivalence relations",
              "Functions and their types",
            ],
          },
          {
            id: 2,
            title: "Complex Numbers",
            topics: [
              "Complex numbers",
              "Algebra of complex numbers",
              "Modulus and argument",
              "Polar form",
              "De Moivre's theorem",
            ],
          },
          {
            id: 3,
            title: "Quadratic Equations",
            topics: [
              "Quadratic equations",
              "Nature of roots",
              "Formation of equations",
              "Theory of equations",
            ],
          },
        ],
      },
    },
  },
  "JEE Advanced": {
    subjects: {
      physics: {
        name: "Physics",
        chapters: [
          {
            id: 1,
            title: "General Physics",
            topics: [
              "Units and dimensions",
              "Dimensional analysis",
              "Least count and significant figures",
              "Errors in measurement",
              "Vectors and scalars",
            ],
          },
          {
            id: 2,
            title: "Mechanics",
            topics: [
              "Kinematics in one and two dimensions",
              "Newton's laws of motion",
              "Friction",
              "Work, energy and power",
              "Conservation laws",
              "Rotational motion",
              "Gravitation",
            ],
          },
          {
            id: 3,
            title: "Thermal Physics",
            topics: [
              "Thermal expansion",
              "Calorimetry",
              "Kinetic theory of gases",
              "Thermodynamics",
              "Heat transfer",
            ],
          },
          {
            id: 4,
            title: "Electricity and Magnetism",
            topics: [
              "Electrostatics",
              "Current electricity",
              "Magnetic effects of current",
              "Electromagnetic induction",
              "Alternating current",
            ],
          },
          {
            id: 5,
            title: "Optics",
            topics: [
              "Geometrical optics",
              "Wave optics",
              "Photometry",
              "Dual nature of radiation",
            ],
          },
        ],
      },
      chemistry: {
        name: "Chemistry",
        chapters: [
          {
            id: 1,
            title: "Physical Chemistry",
            topics: [
              "Basic concepts",
              "States of matter",
              "Atomic structure",
              "Chemical bonding",
              "Chemical thermodynamics",
              "Solutions",
              "Equilibrium",
              "Redox reactions",
              "Electrochemistry",
            ],
          },
          {
            id: 2,
            title: "Inorganic Chemistry",
            topics: [
              "Classification of elements",
              "Hydrogen",
              "s-block elements",
              "p-block elements",
              "d-block elements",
              "f-block elements",
              "Coordination compounds",
            ],
          },
          {
            id: 3,
            title: "Organic Chemistry",
            topics: [
              "Basic principles",
              "Hydrocarbons",
              "Organic compounds containing halogens",
              "Organic compounds containing oxygen",
              "Organic compounds containing nitrogen",
              "Polymers",
              "Biomolecules",
              "Chemistry in everyday life",
            ],
          },
        ],
      },
      mathematics: {
        name: "Mathematics",
        chapters: [
          {
            id: 1,
            title: "Algebra",
            topics: [
              "Complex numbers",
              "Quadratic equations",
              "Sequences and series",
              "Logarithms",
              "Permutations and combinations",
              "Binomial theorem",
              "Matrices",
              "Determinants",
              "Probability",
            ],
          },
          {
            id: 2,
            title: "Trigonometry",
            topics: [
              "Trigonometric functions",
              "Inverse trigonometric functions",
              "Trigonometric equations",
              "Properties of triangles",
              "Heights and distances",
            ],
          },
          {
            id: 3,
            title: "Analytical Geometry",
            topics: [
              "Cartesian coordinates",
              "Straight lines",
              "Circles",
              "Conic sections",
              "Three dimensional geometry",
            ],
          },
          {
            id: 4,
            title: "Differential Calculus",
            topics: [
              "Functions",
              "Limits",
              "Continuity",
              "Differentiability",
              "Methods of differentiation",
              "Applications of derivatives",
            ],
          },
          {
            id: 5,
            title: "Integral Calculus",
            topics: [
              "Indefinite integrals",
              "Definite integrals",
              "Applications of integrals",
              "Differential equations",
            ],
          },
        ],
      },
    },
  },
  NEET: {
    subjects: {
      physics: {
        name: "Physics",
        chapters: [
          {
            id: 1,
            title: "Physical World and Measurement",
            topics: [
              "Physics: Scope and excitement",
              "Nature of physical laws",
              "Physics, technology and society",
              "Units and measurements",
              "Dimensional analysis",
            ],
          },
          {
            id: 2,
            title: "Kinematics",
            topics: [
              "Frame of reference",
              "Motion in a straight line",
              "Motion in a plane",
              "Projectile motion",
              "Uniform circular motion",
              "Relative velocity",
            ],
          },
          {
            id: 3,
            title: "Laws of Motion",
            topics: [
              "Newton's first law of motion",
              "Newton's second law of motion",
              "Newton's third law of motion",
              "Conservation of momentum",
              "Equilibrium of concurrent forces",
              "Friction",
            ],
          },
          {
            id: 4,
            title: "Work, Energy and Power",
            topics: [
              "Work done by a constant force",
              "Work done by a variable force",
              "Kinetic energy",
              "Work-energy theorem",
              "Potential energy",
              "Conservation of mechanical energy",
              "Power",
            ],
          },
          {
            id: 5,
            title: "Motion of System of Particles and Rigid Body",
            topics: [
              "Centre of mass",
              "Linear momentum of system of particles",
              "Vector product of two vectors",
              "Moment of a force",
              "Torque",
              "Angular momentum",
              "Moment of inertia",
              "Radius of gyration",
              "Values of moments of inertia",
              "Parallel and perpendicular axes theorems",
              "Moment of inertia of continuous mass distribution",
            ],
          },
          {
            id: 6,
            title: "Gravitation",
            topics: [
              "Kepler's laws",
              "Universal law of gravitation",
              "Acceleration due to gravity",
              "Gravitational potential energy",
              "Escape velocity",
              "Orbital velocity",
              "Geostationary satellites",
              "Weightlessness",
            ],
          },
        ],
      },
      chemistry: {
        name: "Chemistry",
        chapters: [
          {
            id: 1,
            title: "Some Basic Concepts of Chemistry",
            topics: [
              "General introduction",
              "Importance and scope of chemistry",
              "Historical approach to particulate nature of matter",
              "Laws of chemical combination",
              "Dalton's atomic theory",
              "Concept of elements, atoms and molecules",
              "Atomic and molecular masses",
              "Mole concept and molar mass",
              "Percentage composition",
              "Empirical and molecular formula",
              "Chemical reactions",
              "Stoichiometry and calculations based on stoichiometry",
            ],
          },
          {
            id: 2,
            title: "Structure of Atom",
            topics: [
              "Discovery of electron, proton and neutron",
              "Atomic number",
              "Isotopes and isobars",
              "Thomson's model and its limitations",
              "Rutherford's model and its limitations",
              "Bohr's model and its limitations",
              "Towards quantum mechanical model of atom",
              "Quantum mechanical model of atom",
              "Electronic configuration",
              "Stability of half filled and completely filled orbitals",
            ],
          },
          {
            id: 3,
            title: "Classification of Elements and Periodicity in Properties",
            topics: [
              "Significance of classification",
              "Brief history of the development of periodic table",
              "Modern periodic law and the present form of periodic table",
              "Nomenclature of elements with atomic number > 100",
              "Electronic configuration and types of elements",
              "s, p, d and f block elements",
              "Periodic trends in properties of elements",
              "Effective nuclear charge",
            ],
          },
          {
            id: 4,
            title: "Chemical Bonding and Molecular Structure",
            topics: [
              "Kossel-Lewis approach to chemical bond formation",
              "Concept of ionic and covalent bonds",
              "Bond parameters",
              "Valence Shell Electron Pair Repulsion (VSEPR) theory",
              "Valence bond theory",
              "Hybridisation",
              "Molecular orbital theory",
              "Hydrogen bonding",
            ],
          },
        ],
      },
      biology: {
        name: "Biology",
        chapters: [
          {
            id: 1,
            title: "Diversity in Living World",
            topics: [
              "What is living?",
              "Diversity in the living world",
              "Taxonomic categories",
              "Taxonomical aids",
              "Three domains of life",
              "Bacteria",
              "Archaea",
              "Eukarya",
            ],
          },
          {
            id: 2,
            title: "Structural Organisation in Animals and Plants",
            topics: [
              "Plant tissues",
              "Animal tissues",
              "Morphology and modifications",
              "Tissue and tissue system",
              "Internal structure of dicot and monocot plants",
              "Secondary growth",
            ],
          },
          {
            id: 3,
            title: "Cell Structure and Function",
            topics: [
              "Cell theory",
              "An overview of cell",
              "Prokaryotic and eukaryotic cells",
              "Cell envelope and its modifications",
              "Cell membrane",
              "Cell wall",
              "Cell organelles",
              "Endomembrane system",
              "Mitochondria",
              "Plastids",
              "Ribosomes",
              "Cytoskeleton",
              "Cilia and flagella",
              "Centrosome and centrioles",
              "Nucleus",
              "Microbodies",
              "Vacuoles",
            ],
          },
          {
            id: 4,
            title: "Plant Physiology",
            topics: [
              "Transport in plants",
              "Mineral nutrition",
              "Photosynthesis",
              "Respiration",
              "Plant growth and development",
            ],
          },
          {
            id: 5,
            title: "Human Physiology",
            topics: [
              "Digestion and absorption",
              "Breathing and exchange of gases",
              "Body fluids and circulation",
              "Excretory products and their elimination",
              "Locomotion and movement",
              "Neural control and coordination",
              "Chemical coordination and regulation",
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
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
            <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Syllabus Management
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mt-1">
              Organize and manage course content
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-6 py-3 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
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
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Class:
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-5 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:bg-white dark:hover:bg-gray-600 cursor-pointer"
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-6 py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Subject
              </Button>
            </div>
          </div>

          {/* Current Class Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {selectedClass.includes("JEE") || selectedClass === "NEET"
                      ? `${selectedClass} Syllabus`
                      : `Class ${selectedClass} Syllabus`}
                  </span>
                  <p className="text-base text-purple-700 dark:text-purple-300 mt-1">
                    Comprehensive course structure
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {subjects.length}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                  Subjects
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700 dark:text-purple-300 font-semibold">
                  Total Chapters:{" "}
                  {subjects.reduce(
                    (total, [, subject]) =>
                      total + (subject.chapters?.length || 0),
                    0
                  )}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-12 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
              <FileText className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No syllabus added yet
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Start building your curriculum by adding subjects for{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                Class {selectedClass}
              </span>
            </p>
            <Button
              onClick={() => setShowAddSubject(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-8 py-4 text-lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              Add First Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {subjects.map(([subjectKey, subject]) => (
              <div
                key={subjectKey}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-2 group cursor-pointer overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {subject.name}
                        </h3>
                        <p className="text-base text-gray-500 dark:text-gray-400 font-semibold">
                          {subject.chapters?.length || 0} chapters
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedSubject(subjectKey);
                        setShowAddChapter(true);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer px-6 py-3"
                    >
                      <Plus className="w-5 h-5 mr-2" />
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
                          className="border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 bg-gray-50 dark:bg-gray-700/30 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                              {chapter.title}
                            </h4>
                            <button
                              onClick={() =>
                                handleDeleteChapter(subjectKey, chapter.id)
                              }
                              className="p-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 cursor-pointer"
                              title="Delete Chapter"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {chapter.topics && chapter.topics.length > 0 && (
                            <div className="space-y-3">
                              <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Topics:
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {chapter.topics.map((topic, index) => (
                                  <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-sm text-purple-800 dark:text-purple-200 rounded-xl font-semibold border border-purple-200 dark:border-purple-700"
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
                    <div className="text-center py-16 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-xl transition-colors duration-200">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 hover:scale-105 transition-transform duration-300">
                        <FileText className="w-10 h-10 text-purple-600" />
                      </div>
                      <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold mb-2">
                        No chapters added yet
                      </p>
                      <p className="text-base text-gray-400 dark:text-gray-500">
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
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer"
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
                  className="px-6 py-3 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 cursor-pointer"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 cursor-pointer"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none hover:bg-gray-50 dark:hover:bg-gray-600 cursor-text"
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
                  className="px-6 py-3 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddChapter}
                  disabled={!newChapterData.title.trim() || !selectedSubject}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
