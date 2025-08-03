const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanAndInsertData() {
    try {
        console.log("Cleaning up old data...");

        // Delete all existing data
        await prisma.dailyWork.deleteMany({});
        await prisma.task.deleteMany({});

        console.log("Old data cleaned up successfully!");

        console.log("Starting to insert fresh data...");

        // Create dummy tasks
        const tasks = [
            {
                title: "Complete Project Report",
                description: "Finish quarterly project report",
                status: "completed",
            },
            {
                title: "Read React Documentation",
                description: "Study React hooks and components",
                status: "active",
            },
            {
                title: "Gym Workout",
                description: "Complete 30-minute cardio session",
                status: "completed",
            },
            {
                title: "Learn TypeScript",
                description: "Study TypeScript fundamentals",
                status: "active",
            },
            {
                title: "Design UI Components",
                description: "Create reusable UI components",
                status: "active",
            },
            {
                title: "Write Blog Post",
                description: "Write about modern web development",
                status: "completed",
            },
            {
                title: "Code Review",
                description: "Review team member code submissions",
                status: "active",
            },
            {
                title: "Database Optimization",
                description: "Optimize database queries",
                status: "completed",
            },
            {
                title: "API Documentation",
                description: "Update API documentation",
                status: "active",
            },
            {
                title: "Security Audit",
                description: "Perform security audit of application",
                status: "completed",
            },
            {
                title: "Performance Testing",
                description: "Run performance tests on new features",
                status: "active",
            },
            {
                title: "User Research",
                description: "Conduct user interviews and surveys",
                status: "completed",
            },
            {
                title: "Deploy to Production",
                description: "Deploy latest version to production",
                status: "active",
            },
            {
                title: "Bug Fixes",
                description: "Fix reported bugs in the application",
                status: "completed",
            },
            {
                title: "Team Meeting",
                description: "Weekly team standup and planning",
                status: "active",
            },
        ];

        // Insert tasks
        const createdTasks = [];
        for (const task of tasks) {
            const createdTask = await prisma.task.create({
                data: task,
            });
            createdTasks.push(createdTask);
            console.log(`Created task: ${createdTask.title}`);
        }

        // Generate work history for current month (August 2025)
        const today = new Date();
        const workHistoryData = [];

        // This week (last 7 days)
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];

            // Add 2-4 tasks per day this week
            const tasksForDay = createdTasks.slice(0, 4);
            for (const task of tasksForDay) {
                const workTime = Math.floor(Math.random() * 3600) + 1800; // 30 min to 2 hours
                workHistoryData.push({
                    taskId: task.id,
                    date: new Date(dateStr),
                    totalTime: workTime,
                });
            }
        }

        // This month (August 2025) - from August 1st to today
        const startOfMonth = new Date(2025, 7, 1); // August 1st, 2025 (month is 0-indexed)
        const daysInMonth = new Date(2025, 8, 0).getDate(); // Last day of August

        for (
            let day = 1;
            day <= Math.min(today.getDate(), daysInMonth);
            day++
        ) {
            const date = new Date(2025, 7, day); // August day, 2025
            const dateStr = date.toISOString().split("T")[0];

            // Skip if it's in the future
            if (date > today) continue;

            // Add 1-3 tasks per day this month
            const tasksForDay = createdTasks.slice(4, 8);
            for (const task of tasksForDay) {
                const workTime = Math.floor(Math.random() * 1800) + 900; // 15 min to 1 hour
                workHistoryData.push({
                    taskId: task.id,
                    date: new Date(dateStr),
                    totalTime: workTime,
                });
            }
        }

        // Insert work history
        for (const workData of workHistoryData) {
            await prisma.dailyWork.create({
                data: workData,
            });
        }

        console.log(`Created ${workHistoryData.length} work history records`);
        console.log("Fresh data insertion completed successfully!");
    } catch (error) {
        console.error("Error cleaning and inserting data:", error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanAndInsertData();
