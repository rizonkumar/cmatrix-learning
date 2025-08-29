// Dummy data for development
export const DUMMY_COURSES = [
  {
    id: 1,
    title: "Physics Fundamentals - Class 10",
    description:
      "Master the core concepts of physics with comprehensive lessons covering mechanics, thermodynamics, and electromagnetism.",
    category: "Physics",
    level: "Class 10th",
    instructor: "Dr. Sarah Johnson",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    totalLessons: 24,
    duration: "12 hours",
    rating: 4.8,
    enrolledStudents: 1250,
    price: 2999,
    tags: ["Mechanics", "Thermodynamics", "Electromagnetism"],
  },
  {
    id: 2,
    title: "Mathematics for JEE",
    description:
      "Comprehensive mathematics course covering calculus, linear algebra, and differential equations for JEE preparation.",
    category: "Mathematics",
    level: "IIT-JEE",
    instructor: "Prof. Michael Chen",
    thumbnail:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    totalLessons: 36,
    duration: "18 hours",
    rating: 4.9,
    enrolledStudents: 890,
    price: 5999,
    tags: ["Calculus", "Linear Algebra", "Differential Equations"],
  },
  {
    id: 3,
    title: "Chemistry for NEET",
    description:
      "Complete chemistry preparation for NEET with focus on organic, inorganic, and physical chemistry concepts.",
    category: "Chemistry",
    level: "NEET",
    instructor: "Dr. Priya Sharma",
    thumbnail:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
    totalLessons: 32,
    duration: "16 hours",
    rating: 4.7,
    enrolledStudents: 2100,
    price: 4999,
    tags: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
  },
  {
    id: 4,
    title: "Mathematics Class 8",
    description:
      "Foundation mathematics course for Class 8 students covering basic arithmetic, algebra, and geometry.",
    category: "Mathematics",
    level: "Class 8th",
    instructor: "Mrs. Anita Sharma",
    thumbnail:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    totalLessons: 28,
    duration: "14 hours",
    rating: 4.6,
    enrolledStudents: 950,
    price: 1999,
    tags: ["Arithmetic", "Algebra", "Geometry"],
  },
  {
    id: 5,
    title: "Physics Class 9",
    description:
      "Comprehensive physics course for Class 9 covering motion, force, energy, and basic concepts.",
    category: "Physics",
    level: "Class 9th",
    instructor: "Mr. Rajesh Kumar",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    totalLessons: 22,
    duration: "11 hours",
    rating: 4.5,
    enrolledStudents: 780,
    price: 2499,
    tags: ["Motion", "Force", "Energy"],
  },
  {
    id: 6,
    title: "Chemistry Class 11",
    description:
      "Advanced chemistry course for Class 11 covering organic, inorganic, and physical chemistry fundamentals.",
    category: "Chemistry",
    level: "Class 11th",
    instructor: "Dr. Sunita Patel",
    thumbnail:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
    totalLessons: 30,
    duration: "15 hours",
    rating: 4.7,
    enrolledStudents: 1100,
    price: 3499,
    tags: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
  },
  {
    id: 7,
    title: "Biology Class 12",
    description:
      "Complete biology course for Class 12 covering cell biology, genetics, ecology, and human physiology.",
    category: "Biology",
    level: "Class 12th",
    instructor: "Dr. Robert Davis",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    totalLessons: 28,
    duration: "14 hours",
    rating: 4.6,
    enrolledStudents: 1800,
    price: 3999,
    tags: ["Cell Biology", "Genetics", "Human Physiology"],
  },
  {
    id: 8,
    title: "Computer Science Class 11",
    description:
      "Introduction to programming fundamentals, data structures, and algorithms for Class 11 students.",
    category: "Computer Science",
    level: "Class 11th",
    instructor: "Ms. Emily Rodriguez",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    totalLessons: 35,
    duration: "17.5 hours",
    rating: 4.8,
    enrolledStudents: 1200,
    price: 4499,
    tags: ["Programming", "Data Structures", "Algorithms"],
  },
  {
    id: 9,
    title: "English Class 10",
    description:
      "Comprehensive English course covering literature analysis, grammar rules, and communication skills.",
    category: "English",
    level: "Class 10th",
    instructor: "Prof. James Wilson",
    thumbnail:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    totalLessons: 25,
    duration: "12.5 hours",
    rating: 4.5,
    enrolledStudents: 950,
    price: 2799,
    tags: ["Literature", "Grammar", "Communication"],
  },
];

export const DUMMY_USER = {
  id: 1,
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  role: "student",
  currentStreak: 7,
  longestStreak: 14,
  totalStudyTime: "45h 30m",
  coursesCompleted: 3,
  certificatesEarned: 2,
  joinedDate: "2024-01-15",
};

export const DUMMY_MODULES = [
  {
    id: 1,
    courseId: 1,
    title: "Mechanics",
    description: "Fundamental concepts of motion and forces",
    lessons: [
      {
        id: 1,
        title: "Introduction to Motion",
        duration: "15 min",
        completed: true,
      },
      { id: 2, title: "Newton's Laws", duration: "20 min", completed: true },
      { id: 3, title: "Work and Energy", duration: "18 min", completed: false },
      { id: 4, title: "Momentum", duration: "16 min", completed: false },
    ],
  },
  {
    id: 2,
    courseId: 1,
    title: "Thermodynamics",
    description: "Heat, temperature, and energy transformations",
    lessons: [
      {
        id: 5,
        title: "Heat and Temperature",
        duration: "14 min",
        completed: false,
      },
      {
        id: 6,
        title: "First Law of Thermodynamics",
        duration: "22 min",
        completed: false,
      },
      { id: 7, title: "Heat Engines", duration: "19 min", completed: false },
    ],
  },
];

export const DUMMY_TODOS = [
  { id: 1, taskDescription: "Complete physics assignment", isCompleted: false },
  { id: 2, taskDescription: "Review math chapter 5", isCompleted: true },
  { id: 3, taskDescription: "Practice chemistry problems", isCompleted: false },
  {
    id: 4,
    taskDescription: "Read biology textbook chapter 12",
    isCompleted: false,
  },
];
