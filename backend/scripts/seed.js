import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "../src/models/user.model.js";
import { Course } from "../src/models/course.model.js";
import { Todo } from "../src/models/todo.model.js";
import { KanbanBoard } from "../src/models/kanbanBoard.model.js";
import { KanbanColumn } from "../src/models/kanbanColumn.model.js";
import { KanbanCard } from "../src/models/kanbanCard.model.js";
import { Enrollment } from "../src/models/enrollment.model.js";
import { Syllabus } from "../src/models/syllabus.model.js";
import { Subscription } from "../src/models/subscription.model.js";
import connectDB from "../src/config/db.js";

const additionalCourses = [
  {
    title: "Physics Fundamentals - Class 10",
    description:
      "Master the core concepts of physics with comprehensive lessons covering mechanics, thermodynamics, and electromagnetism.",
    instructor: null, // Will be set after users are created
    category: "Physics",
    thumbnail:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    price: 29.99,
    difficulty: "intermediate",
    isPublished: true,
    modules: [
      {
        title: "Mechanics",
        description: "Fundamental concepts of motion and forces",
        order: 1,
        lessons: [
          {
            title: "Introduction to Motion",
            description:
              "Basic concepts of displacement, velocity, and acceleration",
            content: "https://example.com/videos/introduction-to-motion.mp4",
            contentType: "video",
            duration: 15,
            order: 1,
          },
          {
            title: "Newton's Laws",
            description: "The three fundamental laws of motion",
            content: "https://example.com/videos/newtons-laws.mp4",
            contentType: "video",
            duration: 20,
            order: 2,
          },
          {
            title: "Work and Energy",
            description: "Concepts of work, energy, and power",
            content: "https://example.com/videos/work-and-energy.mp4",
            contentType: "video",
            duration: 18,
            order: 3,
          },
          {
            title: "Momentum",
            description: "Conservation of momentum and impulse",
            content: "https://example.com/videos/momentum.mp4",
            contentType: "video",
            duration: 16,
            order: 4,
          },
        ],
      },
      {
        title: "Thermodynamics",
        description: "Heat, temperature, and energy transformations",
        order: 2,
        lessons: [
          {
            title: "Heat and Temperature",
            description:
              "Understanding the difference between heat and temperature",
            content: "https://example.com/videos/heat-and-temperature.mp4",
            contentType: "video",
            duration: 14,
            order: 1,
          },
          {
            title: "First Law of Thermodynamics",
            description: "Conservation of energy in thermodynamic systems",
            content: "https://example.com/videos/first-law-thermodynamics.mp4",
            contentType: "video",
            duration: 22,
            order: 2,
          },
          {
            title: "Heat Engines",
            description: "Working principles of heat engines",
            content: "https://example.com/videos/heat-engines.mp4",
            contentType: "video",
            duration: 19,
            order: 3,
          },
        ],
      },
    ],
  },
  {
    title: "Mathematics for JEE",
    description:
      "Comprehensive mathematics course covering calculus, linear algebra, and differential equations for JEE preparation.",
    instructor: null,
    category: "Mathematics",
    thumbnail:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    price: 59.99,
    difficulty: "advanced",
    isPublished: true,
    modules: [
      {
        title: "Calculus",
        description: "Limits, derivatives, and integrals",
        order: 1,
        lessons: [
          {
            title: "Limits and Continuity",
            description: "Understanding limits and continuous functions",
            content: "https://example.com/videos/limits-continuity.mp4",
            contentType: "video",
            duration: 25,
            order: 1,
          },
          {
            title: "Derivatives",
            description: "Rate of change and differentiation",
            content: "https://example.com/videos/derivatives.mp4",
            contentType: "video",
            duration: 30,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Chemistry for NEET",
    description:
      "Complete chemistry preparation for NEET with focus on organic, inorganic, and physical chemistry concepts.",
    instructor: null,
    category: "Chemistry",
    thumbnail:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
    price: 49.99,
    difficulty: "intermediate",
    isPublished: true,
    modules: [
      {
        title: "Organic Chemistry",
        description: "Carbon compounds and their reactions",
        order: 1,
        lessons: [
          {
            title: "Introduction to Organic Chemistry",
            description: "Basic concepts and nomenclature",
            content: "https://example.com/videos/organic-intro.mp4",
            contentType: "video",
            duration: 20,
            order: 1,
          },
          {
            title: "Hydrocarbons",
            description: "Alkanes, alkenes, and alkynes",
            content: "https://example.com/videos/hydrocarbons.mp4",
            contentType: "video",
            duration: 25,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Mathematics Class 8",
    description:
      "Foundation mathematics course for Class 8 students covering basic arithmetic, algebra, and geometry.",
    instructor: null,
    category: "Mathematics",
    thumbnail:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    price: 19.99,
    difficulty: "beginner",
    isPublished: true,
    modules: [
      {
        title: "Basic Arithmetic",
        description: "Numbers, operations, and fractions",
        order: 1,
        lessons: [
          {
            title: "Number Systems",
            description: "Natural, whole, and integers",
            content: "https://example.com/videos/number-systems.mp4",
            contentType: "video",
            duration: 15,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    title: "Computer Science Class 11",
    description:
      "Introduction to programming fundamentals, data structures, and algorithms for Class 11 students.",
    instructor: null,
    category: "Mathematics",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    price: 44.99,
    difficulty: "intermediate",
    isPublished: true,
    modules: [
      {
        title: "Programming Fundamentals",
        description: "Basic programming concepts and logic",
        order: 1,
        lessons: [
          {
            title: "Introduction to Programming",
            description: "What is programming and why learn it",
            content: "https://example.com/videos/programming-intro.mp4",
            contentType: "video",
            duration: 18,
            order: 1,
          },
        ],
      },
    ],
  },
];

const additionalTodos = [
  {
    taskDescription: "Complete physics homework chapter 3",
    isCompleted: false,
    owner: null, // Will be set after users are created
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    taskDescription: "Review math chapter 5",
    isCompleted: true,
    owner: null,
    priority: "medium",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    taskDescription: "Practice chemistry problems",
    isCompleted: false,
    owner: null,
    priority: "medium",
  },
  {
    taskDescription: "Read biology textbook chapter 12",
    isCompleted: false,
    owner: null,
    priority: "low",
  },
];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Dummy data
const users = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    fullName: "John Doe",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    currentStreak: 7,
    longestStreak: 15,
    lastActivityDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    username: "sarah_smith",
    email: "sarah.smith@example.com",
    fullName: "Sarah Smith",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    currentStreak: 3,
    longestStreak: 8,
    lastActivityDate: new Date(),
  },
  {
    username: "dr_emily",
    email: "emily.johnson@example.com",
    fullName: "Dr. Emily Johnson",
    password: "Password123!",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    currentStreak: 12,
    longestStreak: 25,
    lastActivityDate: new Date(),
  },
  {
    username: "prof_mike",
    email: "michael.brown@example.com",
    fullName: "Prof. Michael Brown",
    password: "Password123!",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    currentStreak: 20,
    longestStreak: 45,
    lastActivityDate: new Date(),
  },
  {
    username: "admin_user",
    email: "admin@cmatrix.com",
    fullName: "System Administrator",
    password: "Admin123!",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    currentStreak: 30,
    longestStreak: 60,
    lastActivityDate: new Date(),
  },
  {
    username: "alex_student",
    email: "alex.wilson@example.com",
    fullName: "Alex Wilson",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    currentStreak: 1,
    longestStreak: 3,
    lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    username: "lisa_teacher",
    email: "lisa.davis@example.com",
    fullName: "Lisa Davis",
    password: "Password123!",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    currentStreak: 5,
    longestStreak: 12,
    lastActivityDate: new Date(),
  },
  {
    username: "student_jane",
    email: "jane.taylor@example.com",
    fullName: "Jane Taylor",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    currentStreak: 0,
    longestStreak: 2,
    lastActivityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    username: "rahul_sharma",
    email: "rahul.sharma@example.com",
    fullName: "Rahul Sharma",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    currentStreak: 5,
    longestStreak: 12,
    lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    username: "priya_patel",
    email: "priya.patel@example.com",
    fullName: "Priya Patel",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    currentStreak: 8,
    longestStreak: 18,
    lastActivityDate: new Date(),
  },
  {
    username: "arjun_verma",
    email: "arjun.verma@example.com",
    fullName: "Arjun Verma",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
    currentStreak: 3,
    longestStreak: 7,
    lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    username: "kavya_singh",
    email: "kavya.singh@example.com",
    fullName: "Kavya Singh",
    password: "Password123!",
    role: "student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavya",
    currentStreak: 10,
    longestStreak: 22,
    lastActivityDate: new Date(),
  },
];

const syllabi = [
  {
    title: "CBSE Class 8th Standard Syllabus",
    description:
      "Complete syllabus for CBSE Class 8th covering Mathematics, Science, and Social Studies",
    classLevel: "8th",
    isActive: true,
    version: "2024",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          {
            title: "Number Systems",
            order: 1,
            topics: [
              { name: "Natural Numbers", order: 1 },
              { name: "Whole Numbers", order: 2 },
              { name: "Integers", order: 3 },
              { name: "Rational Numbers", order: 4 },
            ],
          },
          {
            title: "Algebra",
            order: 2,
            topics: [
              { name: "Expressions", order: 1 },
              { name: "Equations", order: 2 },
              { name: "Linear Equations", order: 3 },
            ],
          },
        ],
      },
      {
        name: "Science",
        chapters: [
          {
            title: "Crop Production and Management",
            order: 1,
            topics: [
              { name: "Agriculture", order: 1 },
              { name: "Irrigation", order: 2 },
              { name: "Crop Protection", order: 3 },
            ],
          },
          {
            title: "Microorganisms",
            order: 2,
            topics: [
              { name: "Bacteria", order: 1 },
              { name: "Fungi", order: 2 },
              { name: "Protozoa", order: 3 },
              { name: "Viruses", order: 4 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "CBSE Class 9th Standard Syllabus",
    description:
      "Complete syllabus for CBSE Class 9th covering Mathematics, Science, and Social Studies",
    classLevel: "9th",
    isActive: true,
    version: "2024",
    subjects: [
      {
        name: "Mathematics",
        chapters: [
          {
            title: "Number Systems",
            order: 1,
            topics: [
              { name: "Real Numbers", order: 1 },
              { name: "Irrational Numbers", order: 2 },
              { name: "Real Numbers and their Decimal Expansions", order: 3 },
            ],
          },
          {
            title: "Polynomials",
            order: 2,
            topics: [
              { name: "Introduction", order: 1 },
              { name: "Zeros of a Polynomial", order: 2 },
              { name: "Remainder Theorem", order: 3 },
            ],
          },
        ],
      },
      {
        name: "Science",
        chapters: [
          {
            title: "Matter in Our Surroundings",
            order: 1,
            topics: [
              { name: "Physical Nature of Matter", order: 1 },
              { name: "Characteristics of Particles of Matter", order: 2 },
              { name: "States of Matter", order: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "JEE Main Physics Syllabus",
    description: "Complete physics syllabus for JEE Main examination",
    classLevel: "JEE Main",
    isActive: true,
    version: "2024",
    subjects: [
      {
        name: "Physics",
        chapters: [
          {
            title: "Units and Measurements",
            order: 1,
            topics: [
              { name: "Physical quantities and their units", order: 1 },
              { name: "Dimensional analysis", order: 2 },
              { name: "Significant figures", order: 3 },
            ],
          },
          {
            title: "Kinematics",
            order: 2,
            topics: [
              { name: "Motion in a straight line", order: 1 },
              { name: "Motion in a plane", order: 2 },
              { name: "Projectile motion", order: 3 },
            ],
          },
          {
            title: "Laws of Motion",
            order: 3,
            topics: [
              { name: "Newton's laws of motion", order: 1 },
              { name: "Friction", order: 2 },
              { name: "Dynamics of rigid bodies", order: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "JEE Advanced Physics Syllabus",
    description: "Advanced physics syllabus for JEE Advanced examination",
    classLevel: "JEE Advanced",
    isActive: true,
    version: "2024",
    subjects: [
      {
        name: "Physics",
        chapters: [
          {
            title: "General Physics",
            order: 1,
            topics: [
              { name: "Units and dimensions", order: 1 },
              { name: "Dimensional analysis", order: 2 },
              { name: "Least count and significant figures", order: 3 },
            ],
          },
          {
            title: "Mechanics",
            order: 2,
            topics: [
              { name: "Kinematics in one and two dimensions", order: 1 },
              { name: "Newton's laws of motion", order: 2 },
              { name: "Friction", order: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "NEET Biology Syllabus",
    description: "Complete biology syllabus for NEET examination",
    classLevel: "NEET",
    isActive: true,
    version: "2024",
    subjects: [
      {
        name: "Biology",
        chapters: [
          {
            title: "Diversity in Living World",
            order: 1,
            topics: [
              { name: "What is living?", order: 1 },
              { name: "Diversity in the living world", order: 2 },
              { name: "Taxonomic categories", order: 3 },
            ],
          },
          {
            title: "Structural Organisation in Animals and Plants",
            order: 2,
            topics: [
              { name: "Plant tissues", order: 1 },
              { name: "Animal tissues", order: 2 },
              { name: "Morphology and modifications", order: 3 },
            ],
          },
        ],
      },
    ],
  },
];

const courses = [
  {
    title: "Physics Fundamentals",
    description:
      "Master the basic concepts of physics including mechanics, thermodynamics, and electromagnetism.",
    instructor: null,
    category: "Physics",
    thumbnail:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    price: 49.99,
    difficulty: "intermediate",
    isPublished: true,
    modules: [
      {
        title: "Classical Mechanics",
        description: "Newton's laws, motion, and energy",
        order: 1,
        lessons: [
          {
            title: "Introduction to Motion",
            description:
              "Basic concepts of displacement, velocity, and acceleration",
            content: "https://example.com/videos/motion-intro.mp4",
            contentType: "video",
            duration: 45,
            order: 1,
          },
          {
            title: "Newton's Laws",
            description: "The three fundamental laws of motion",
            content: "https://example.com/videos/newtons-laws.mp4",
            contentType: "video",
            duration: 60,
            order: 2,
          },
          {
            title: "Practice Problems",
            description: "Solve problems related to Newton's laws",
            content: "https://example.com/quizzes/newtons-laws-quiz",
            contentType: "quiz",
            duration: 30,
            order: 3,
          },
        ],
      },
      {
        title: "Thermodynamics",
        description: "Heat, temperature, and the laws of thermodynamics",
        order: 2,
        lessons: [
          {
            title: "Heat and Temperature",
            description:
              "Understanding the difference between heat and temperature",
            content: "https://example.com/videos/heat-temperature.mp4",
            contentType: "video",
            duration: 40,
            order: 1,
          },
          {
            title: "First Law of Thermodynamics",
            description: "Conservation of energy in thermodynamic systems",
            content: "https://example.com/videos/thermodynamics-first-law.mp4",
            contentType: "video",
            duration: 55,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Organic Chemistry Basics",
    description:
      "Learn the fundamentals of organic chemistry including molecular structures, reactions, and mechanisms.",
    instructor: null,
    category: "Chemistry",
    thumbnail:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400",
    price: 39.99,
    difficulty: "beginner",
    isPublished: true,
    modules: [
      {
        title: "Carbon Compounds",
        description: "Structure and bonding in organic molecules",
        order: 1,
        lessons: [
          {
            title: "Carbon Bonding",
            description: "How carbon forms bonds and creates diverse molecules",
            content: "https://example.com/videos/carbon-bonding.mp4",
            contentType: "video",
            duration: 35,
            order: 1,
          },
          {
            title: "Functional Groups",
            description: "Common functional groups in organic chemistry",
            content: "https://example.com/videos/functional-groups.mp4",
            contentType: "video",
            duration: 50,
            order: 2,
          },
        ],
      },
    ],
  },
  {
    title: "Calculus I",
    description:
      "Comprehensive introduction to differential and integral calculus with real-world applications.",
    instructor: null,
    category: "Mathematics",
    thumbnail:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    price: 59.99,
    difficulty: "intermediate",
    isPublished: true,
    modules: [
      {
        title: "Limits and Continuity",
        description: "Understanding limits and continuous functions",
        order: 1,
        lessons: [
          {
            title: "Introduction to Limits",
            description: "Basic concepts and calculations of limits",
            content: "https://example.com/videos/limits-intro.mp4",
            contentType: "video",
            duration: 45,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    title: "IIT-JEE Physics Advanced",
    description:
      "Advanced physics concepts specifically designed for IIT-JEE preparation.",
    instructor: null,
    category: "IIT-JEE",
    thumbnail:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    price: 99.99,
    difficulty: "advanced",
    isPublished: true,
    modules: [
      {
        title: "Mechanics Advanced",
        description: "Advanced concepts in classical mechanics",
        order: 1,
        lessons: [
          {
            title: "Rigid Body Dynamics",
            description: "Motion of rigid bodies and rotational mechanics",
            content: "https://example.com/videos/rigid-body-dynamics.mp4",
            contentType: "video",
            duration: 75,
            order: 1,
          },
        ],
      },
    ],
  },
  // Add additional courses from constants.js
  ...additionalCourses,
];

const todos = [
  {
    taskDescription: "Review physics homework chapter 3",
    isCompleted: false,
    owner: null, // Will be set after users are created
    priority: "high",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
  },
  {
    taskDescription: "Practice organic chemistry reactions",
    isCompleted: true,
    owner: null,
    priority: "medium",
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    taskDescription: "Solve calculus integration problems",
    isCompleted: false,
    owner: null,
    priority: "high",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
  },
  {
    taskDescription: "Watch physics lecture on thermodynamics",
    isCompleted: false,
    owner: null,
    priority: "medium",
  },
  {
    taskDescription: "Complete chemistry lab report",
    isCompleted: true,
    owner: null,
    priority: "high",
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  // Add additional todos from constants.js
  ...additionalTodos,
];

const subscriptions = [
  // John Doe subscriptions
  {
    user: null, // Will be set after users are created
    subscriptionType: "monthly",
    amount: 500,
    pendingAmount: 0,
    paymentStatus: "paid",
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    paymentMethod: "online",
    transactionId: "TXN_001",
    createdBy: null, // Will be set to admin
    paymentHistory: [
      {
        amount: 500,
        paymentDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        paymentMethod: "online",
        transactionId: "TXN_001",
        updatedBy: null,
        notes: "Monthly subscription paid online",
      },
    ],
  },
  {
    user: null,
    subscriptionType: "yearly",
    amount: 5000,
    pendingAmount: 1000,
    paymentStatus: "partial",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 11 months from now
    paymentMethod: "cash",
    createdBy: null,
    paymentHistory: [
      {
        amount: 4000,
        paymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        paymentMethod: "cash",
        updatedBy: null,
        notes: "Partial payment received",
      },
    ],
  },
  // Sarah Smith subscriptions
  {
    user: null,
    subscriptionType: "6-months",
    amount: 2500,
    pendingAmount: 2500,
    paymentStatus: "pending",
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months from now
    paymentMethod: "cash",
    createdBy: null,
  },
  {
    user: null,
    subscriptionType: "monthly",
    amount: 500,
    pendingAmount: 500,
    paymentStatus: "overdue",
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    endDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    paymentMethod: "cash",
    createdBy: null,
  },
  // Rahul Sharma subscriptions
  {
    user: null,
    subscriptionType: "yearly",
    amount: 5000,
    pendingAmount: 0,
    paymentStatus: "paid",
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), // 9 months from now
    paymentMethod: "bank-transfer",
    transactionId: "TXN_002",
    createdBy: null,
    paymentHistory: [
      {
        amount: 5000,
        paymentDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        paymentMethod: "bank-transfer",
        transactionId: "TXN_002",
        updatedBy: null,
        notes: "Full yearly payment via bank transfer",
      },
    ],
  },
  // Priya Patel subscriptions
  {
    user: null,
    subscriptionType: "monthly",
    amount: 500,
    pendingAmount: 250,
    paymentStatus: "partial",
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    paymentMethod: "cash",
    createdBy: null,
    paymentHistory: [
      {
        amount: 250,
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        paymentMethod: "cash",
        updatedBy: null,
        notes: "Partial payment received",
      },
    ],
  },
  // Arjun Verma subscriptions
  {
    user: null,
    subscriptionType: "6-months",
    amount: 2500,
    pendingAmount: 0,
    paymentStatus: "paid",
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    endDate: new Date(Date.now() + 160 * 24 * 60 * 60 * 1000), // 5+ months from now
    paymentMethod: "online",
    transactionId: "TXN_003",
    createdBy: null,
    paymentHistory: [
      {
        amount: 2500,
        paymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        paymentMethod: "online",
        transactionId: "TXN_003",
        updatedBy: null,
        notes: "6-month subscription paid online",
      },
    ],
  },
  // Kavya Singh subscriptions
  {
    user: null,
    subscriptionType: "monthly",
    amount: 500,
    pendingAmount: 500,
    paymentStatus: "pending",
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    paymentMethod: "cash",
    createdBy: null,
  },
];

const kanbanBoards = [
  {
    boardName: "IIT-JEE Physics Prep",
    owner: null, // Will be set after users are created
    description: "Track my IIT-JEE physics preparation progress",
    color: "#3B82F6",
  },
  {
    boardName: "Chemistry Revision",
    owner: null,
    description: "Organize chemistry topics for revision",
    color: "#10B981",
  },
  {
    boardName: "Math Problem Solving",
    owner: null,
    description: "Mathematics problem-solving workflow",
    color: "#F59E0B",
  },
];

const kanbanColumns = [
  { title: "To Study", order: 1, color: "#EF4444" },
  { title: "In Progress", order: 2, color: "#F59E0B" },
  { title: "Completed", order: 3, color: "#10B981" },
  { title: "Revision", order: 4, color: "#3B82F6" },
];

const kanbanCards = [
  {
    title: "Newton's Laws",
    description: "Master the three laws of motion with practice problems",
    order: 1,
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Thermodynamics",
    description:
      "Complete all thermodynamics problems from previous year papers",
    order: 2,
    priority: "medium",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Organic Reactions",
    description: "Memorize and practice 50+ organic reactions",
    order: 1,
    priority: "high",
  },
  {
    title: "Integration Techniques",
    description: "Master different integration methods and their applications",
    order: 1,
    priority: "high",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
];

// Load syllabus data from JSON file
let syllabusCourses = [];
try {
  const syllabusDataPath = path.join(__dirname, "syllabus-data.json");
  const syllabusData = fs.readFileSync(syllabusDataPath, "utf8");
  syllabusCourses = JSON.parse(syllabusData);
  console.log(
    `📚 Loaded ${syllabusCourses.length} syllabus courses from JSON file`
  );

  syllabusCourses = syllabusCourses.map((course) => {
    // Map categories to allowed enum values
    let mappedCategory = course.category;
    if (course.category === "CBSE Class 8") mappedCategory = "Class 10";
    else if (course.category === "CBSE Class 9") mappedCategory = "Class 11";
    else if (course.category === "CBSE Class 10") mappedCategory = "Class 10";
    // IIT-JEE and NEET are already valid

    return {
      ...course,
      category: mappedCategory,
      instructor: null, // Will be set after users are created
      thumbnail:
        course.thumbnailUrl ||
        "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
      price:
        course.category.includes("IIT-JEE") || course.category.includes("NEET")
          ? 999
          : 499,
      difficulty: course.category.includes("IIT-JEE")
        ? "advanced"
        : course.category.includes("NEET")
        ? "intermediate"
        : "intermediate",
      isPublished: true,
      modules: course.modules.map((module, moduleIndex) => ({
        ...module,
        order: moduleIndex + 1,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          content: `https://example.com/videos/${lesson.title
            .toLowerCase()
            .replace(/\s+/g, "-")}.mp4`,
          duration: Math.floor(Math.random() * 30) + 15,
          order: lessonIndex + 1,
        })),
      })),
    };
  });
} catch (error) {
  console.warn("⚠️  Could not load syllabus data:", error.message);
}

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Todo.deleteMany({});
    await KanbanBoard.deleteMany({});
    await KanbanColumn.deleteMany({});
    await KanbanCard.deleteMany({});
    await Enrollment.deleteMany({});
    await Syllabus.deleteMany({});
    await Subscription.deleteMany({});

    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    // Create syllabi
    const adminUser = createdUsers.find((user) => user.role === "admin");
    const syllabiWithAdmin = syllabi.map((syllabus) => ({
      ...syllabus,
      createdBy: adminUser._id,
    }));

    const createdSyllabi = await Syllabus.insertMany(syllabiWithAdmin);

    // Set instructor IDs for courses
    const teacherUsers = createdUsers.filter((user) => user.role === "teacher");

    // Assign instructors to all courses
    courses.forEach((course, index) => {
      // Alternate between teachers for variety
      const teacherIndex = index % teacherUsers.length;
      course.instructor = teacherUsers[teacherIndex]._id;
    });

    // Create courses
    const createdCourses = await Course.insertMany(courses);

    // Create syllabus courses (set teacher to first teacher user)
    if (syllabusCourses.length > 0) {
      console.log("📖 Creating syllabus courses...");
      const syllabusCoursesWithTeacher = syllabusCourses.map((course) => ({
        ...course,
        instructor: teacherUsers[0]._id,
      }));

      const createdSyllabusCourses = await Course.insertMany(
        syllabusCoursesWithTeacher
      );
      console.log(
        `✅ Created ${createdSyllabusCourses.length} syllabus courses`
      );
    }

    const studentUsers = createdUsers.filter((user) => user.role === "student");

    // Assign owners to all todos
    todos.forEach((todo, index) => {
      // Alternate between student users for variety
      const studentIndex = index % studentUsers.length;
      todo.owner = studentUsers[studentIndex]._id;
    });

    // Create todos
    const createdTodos = await Todo.insertMany(todos);
    console.log(`✅ Created ${createdTodos.length} todos`);

    // Set owner IDs for kanban boards
    kanbanBoards[0].owner = studentUsers[0]._id; // john_doe
    kanbanBoards[1].owner = studentUsers[1]._id; // sarah_smith
    kanbanBoards[2].owner = studentUsers[0]._id; // john_doe

    // Create kanban boards
    console.log("📋 Creating kanban boards...");
    const createdBoards = await KanbanBoard.insertMany(kanbanBoards);
    console.log(`✅ Created ${createdBoards.length} kanban boards`);

    // Create kanban columns for each board
    console.log("📊 Creating kanban columns...");
    const allColumns = [];
    for (const board of createdBoards) {
      for (const columnData of kanbanColumns) {
        allColumns.push({
          ...columnData,
          boardId: board._id,
        });
      }
    }
    const createdColumns = await KanbanColumn.insertMany(allColumns);
    console.log(`✅ Created ${createdColumns.length} kanban columns`);

    // Create kanban cards
    console.log("🎴 Creating kanban cards...");
    const boardColumns = createdColumns.filter(
      (col) => col.title === "To Study"
    );
    kanbanCards[0].columnId = boardColumns[0]._id;
    kanbanCards[0].boardId = boardColumns[0].boardId;
    kanbanCards[1].columnId = boardColumns[0]._id;
    kanbanCards[1].boardId = boardColumns[0].boardId;
    kanbanCards[2].columnId = boardColumns[1]._id;
    kanbanCards[2].boardId = boardColumns[1].boardId;
    kanbanCards[3].columnId = boardColumns[2]._id;
    kanbanCards[3].boardId = boardColumns[2].boardId;

    const createdCards = await KanbanCard.insertMany(kanbanCards);
    console.log(`✅ Created ${createdCards.length} kanban cards`);

    // Create enrollments
    console.log("📝 Creating enrollments...");
    const enrollments = [
      // John Doe enrollments
      {
        student: studentUsers[0]._id,
        course: createdCourses[0]._id,
        progress: 75,
        completedLessons: [],
        isCompleted: false,
      },
      {
        student: studentUsers[0]._id,
        course: createdCourses[Math.min(2, createdCourses.length - 1)]._id,
        progress: 30,
        completedLessons: [],
        isCompleted: false,
      },
      // Sarah Smith enrollments
      {
        student: studentUsers[1]._id,
        course: createdCourses[1]._id,
        progress: 100,
        completedLessons: [],
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        student: studentUsers[1]._id,
        course: createdCourses[0]._id,
        progress: 80,
        completedLessons: [],
        isCompleted: false,
      },
      // Additional student enrollments for better analytics
      {
        student: studentUsers[2]._id, // rahul_sharma
        course: createdCourses[0]._id,
        progress: 50,
        completedLessons: [],
        isCompleted: false,
      },
      {
        student: studentUsers[3]._id, // priya_patel
        course: createdCourses[1]._id,
        progress: 25,
        completedLessons: [],
        isCompleted: false,
      },
      {
        student: studentUsers[4]._id, // arjun_verma
        course: createdCourses[Math.min(2, createdCourses.length - 1)]._id,
        progress: 90,
        completedLessons: [],
        isCompleted: false,
      },
      {
        student: studentUsers[5]._id, // kavya_singh
        course: createdCourses[Math.min(3, createdCourses.length - 1)]._id,
        progress: 60,
        completedLessons: [],
        isCompleted: false,
      },
      {
        student: studentUsers[6]._id, // student_jane
        course: createdCourses[Math.min(4, createdCourses.length - 1)]._id,
        progress: 15,
        completedLessons: [],
        isCompleted: false,
      },
      // More enrollments for comprehensive data
      {
        student: studentUsers[2]._id, // rahul_sharma
        course: createdCourses[Math.min(5, createdCourses.length - 1)]._id,
        progress: 85,
        completedLessons: [],
        isCompleted: false,
      },
      {
        student: studentUsers[3]._id, // priya_patel
        course: createdCourses[Math.min(6, createdCourses.length - 1)]._id,
        progress: 100,
        completedLessons: [],
        isCompleted: true,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        student: studentUsers[4]._id, // arjun_verma
        course: createdCourses[Math.min(7, createdCourses.length - 1)]._id,
        progress: 45,
        completedLessons: [],
        isCompleted: false,
      },
    ];

    const createdEnrollments = await Enrollment.insertMany(enrollments);
    console.log(`✅ Created ${createdEnrollments.length} enrollments`);

    // Update course enrollment counts
    for (const enrollment of createdEnrollments) {
      await Course.findByIdAndUpdate(enrollment.course, {
        $push: { enrolledStudents: enrollment.student },
      });
    }

    // Create subscriptions
    console.log("💰 Creating subscriptions...");
    const subscriptionsWithUsers = subscriptions.map((subscription, index) => {
      let userIndex = 0;
      // Assign subscriptions to different users
      if (index < 2) userIndex = 0; // John Doe gets first 2 subscriptions
      else if (index < 4) userIndex = 1; // Sarah Smith gets next 2
      else if (index < 5) userIndex = 2; // Rahul Sharma gets 1
      else if (index < 6) userIndex = 3; // Priya Patel gets 1
      else if (index < 7) userIndex = 4; // Arjun Verma gets 1
      else userIndex = 5; // Kavya Singh gets 1

      return {
        ...subscription,
        user: studentUsers[userIndex]._id,
        createdBy: adminUser._id,
        paymentHistory: (subscription.paymentHistory || []).map((payment) => ({
          ...payment,
          updatedBy: adminUser._id,
        })),
      };
    });

    const createdSubscriptions = await Subscription.insertMany(
      subscriptionsWithUsers
    );
    console.log(`✅ Created ${createdSubscriptions.length} subscriptions`);

    // Update user subscription references
    for (let i = 0; i < studentUsers.length; i++) {
      const userSubscriptions = createdSubscriptions.filter(
        (sub) => sub.user.toString() === studentUsers[i]._id.toString()
      );
      if (userSubscriptions.length > 0) {
        await User.findByIdAndUpdate(studentUsers[i]._id, {
          $push: {
            subscriptions: { $each: userSubscriptions.map((sub) => sub._id) },
          },
        });
      }
    }

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📚 Syllabi: ${createdSyllabi.length}`);
    console.log(`   📚 Courses: ${createdCourses.length}`);
    console.log(`   ✅ Todos: ${createdTodos.length}`);
    console.log(`   📋 Kanban Boards: ${createdBoards.length}`);
    console.log(`   📊 Kanban Columns: ${createdColumns.length}`);
    console.log(`   🎴 Kanban Cards: ${createdCards.length}`);
    console.log(`   📝 Enrollments: ${createdEnrollments.length}`);
    console.log(`   💰 Subscriptions: ${createdSubscriptions.length}`);

    console.log("\n🔑 Test Accounts:");
    console.log("   Admin: admin@cmatrix.com / Admin123!");
    console.log("   Teacher: emily.johnson@example.com / Password123!");
    console.log("   Student: john.doe@example.com / Password123!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

connectDB()
  .then(() => {
    return seedDatabase();
  })
  .then(() => {
    console.log("\n✅ Seeding process completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
