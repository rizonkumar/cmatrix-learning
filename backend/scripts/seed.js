import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { Course } from "../src/models/course.model.js";
import { Todo } from "../src/models/todo.model.js";
import { KanbanBoard } from "../src/models/kanbanBoard.model.js";
import { KanbanColumn } from "../src/models/kanbanColumn.model.js";
import { KanbanCard } from "../src/models/kanbanCard.model.js";
import { Enrollment } from "../src/models/enrollment.model.js";
import connectDB from "../src/config/db.js";

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
    lastActivityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
];

const courses = [
  {
    title: "Physics Fundamentals",
    description:
      "Master the basic concepts of physics including mechanics, thermodynamics, and electromagnetism.",
    instructor: null, // Will be set after users are created
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

// Seed function
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

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Set instructor IDs for courses
    const teacherUsers = createdUsers.filter((user) => user.role === "teacher");
    courses[0].instructor = teacherUsers[0]._id; // Physics Fundamentals
    courses[1].instructor = teacherUsers[1]._id; // Organic Chemistry
    courses[2].instructor = teacherUsers[0]._id; // Calculus
    courses[3].instructor = teacherUsers[1]._id; // IIT-JEE Physics

    // Create courses
    console.log("📚 Creating courses...");
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Set owner IDs for todos
    const studentUsers = createdUsers.filter((user) => user.role === "student");
    todos[0].owner = studentUsers[0]._id; // john_doe
    todos[1].owner = studentUsers[1]._id; // sarah_smith
    todos[2].owner = studentUsers[0]._id; // john_doe
    todos[3].owner = studentUsers[1]._id; // sarah_smith
    todos[4].owner = studentUsers[2]._id; // alex_student

    // Create todos
    console.log("✅ Creating todos...");
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
      {
        student: studentUsers[0]._id,
        course: createdCourses[0]._id,
        progress: 75,
        completedLessons: [
          {
            lessonId: createdCourses[0].modules[0].lessons[0]._id,
            completedAt: new Date(),
          },
          {
            lessonId: createdCourses[0].modules[0].lessons[1]._id,
            completedAt: new Date(),
          },
        ],
        isCompleted: false,
      },
      {
        student: studentUsers[1]._id,
        course: createdCourses[1]._id,
        progress: 100,
        completedLessons: [
          {
            lessonId: createdCourses[1].modules[0].lessons[0]._id,
            completedAt: new Date(),
          },
          {
            lessonId: createdCourses[1].modules[0].lessons[1]._id,
            completedAt: new Date(),
          },
        ],
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        student: studentUsers[0]._id,
        course: createdCourses[2]._id,
        progress: 30,
        completedLessons: [
          {
            lessonId: createdCourses[2].modules[0].lessons[0]._id,
            completedAt: new Date(),
          },
        ],
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

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   📚 Courses: ${createdCourses.length}`);
    console.log(`   ✅ Todos: ${createdTodos.length}`);
    console.log(`   📋 Kanban Boards: ${createdBoards.length}`);
    console.log(`   📊 Kanban Columns: ${createdColumns.length}`);
    console.log(`   🎴 Kanban Cards: ${createdCards.length}`);
    console.log(`   📝 Enrollments: ${createdEnrollments.length}`);

    console.log("\n🔑 Test Accounts:");
    console.log("   Admin: admin@cmatrix.com / Admin123!");
    console.log("   Teacher: emily.johnson@example.com / Password123!");
    console.log("   Student: john.doe@example.com / Password123!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeder
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
