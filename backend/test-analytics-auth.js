import axios from "axios";

async function testAnalyticsWithAuth() {
  try {
    console.log("Testing Analytics API with Authentication...");

    // First, login to get JWT token
    const loginResponse = await axios.post(
      "http://localhost:8000/api/v1/users/login",
      {
        email: "admin@cmatrix.com",
        password: "Admin123!",
      }
    );

    const token = loginResponse.data.data.accessToken;

    // Now test the analytics API with the token
    const analyticsResponse = await axios.get(
      "http://localhost:8000/api/v1/admin/analytics",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const analytics = analyticsResponse.data.data;

    console.log("✅ Analytics API working successfully!");
    console.log("\n📊 Analytics Summary:");
    console.log(`   👥 Total Users: ${analytics.totalUsers}`);
    console.log(`   🎯 Active Users: ${analytics.activeUsers}`);
    console.log(`   📚 Total Courses: ${analytics.totalCourses}`);
    console.log(`   ✅ Course Completions: ${analytics.courseCompletions}`);
    console.log(`   📝 Total Enrollments: ${analytics.totalEnrollments}`);
    console.log(`   💰 Total Revenue: ₹${analytics.totalRevenue}`);

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
    console.error(
      "❌ Error testing analytics API:",
      error.response?.data?.message || error.message
    );

    if (error.response?.status === 401) {
      console.log("\n🔧 Authentication failed. Please check:");
      console.log("   1. Admin credentials: admin@cmatrix.com / Admin123!");
      console.log("   2. Database is seeded with admin user");
    } else {
      console.log("\n🔧 Please make sure:");
      console.log("   1. Backend server is running on port 8000");
      console.log("   2. Database is connected and has data");
    }
  }
}

testAnalyticsWithAuth();
