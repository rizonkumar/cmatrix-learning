import { adminService } from "./src/services/admin.service.js";

async function testAnalyticsAPI() {
  try {
    console.log("Testing Analytics API...");

    const analytics = await adminService.getComprehensiveAnalytics("30d");

    console.log("✅ Analytics API working successfully!");
    console.log("\n📊 Analytics Summary:");
    console.log(`   👥 Total Users: ${analytics.totalUsers}`);
    console.log(`   🎯 Active Users: ${analytics.activeUsers}`);
    console.log(`   📚 Total Courses: ${analytics.totalCourses}`);
    console.log(`   ✅ Course Completions: ${analytics.courseCompletions}`);
    console.log(`   📝 Total Enrollments: ${analytics.totalEnrollments}`);

    console.log("\n📈 Chart Data Available:");
    console.log(
      `   User Growth Data Points: ${analytics.userGrowth?.length || 0}`
    );
    console.log(
      `   Course Engagement Data Points: ${
        analytics.courseEngagement?.length || 0
      }`
    );
    console.log(
      `   Revenue Data Points: ${analytics.revenueData?.length || 0}`
    );

    console.log("\n🎉 Analytics Dashboard is ready!");
  } catch (error) {
    console.error("❌ Error testing analytics API:", error.message);
    console.log("\n🔧 Please make sure:");
    console.log("   1. MongoDB is running");
    console.log("   2. Database is seeded with data");
    console.log("   3. Backend server is running on port 8000");
  }
}

testAnalyticsAPI();
