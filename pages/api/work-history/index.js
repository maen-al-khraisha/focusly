import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { startDate, endDate } = req.query;

            // Get daily work records
            let dailyWorkWhere = {};
            if (startDate && endDate) {
                dailyWorkWhere.date = {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                };
            }

            const dailyWork = await prisma.dailyWork.findMany({
                where: dailyWorkWhere,
                include: {
                    task: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            status: true,
                        },
                    },
                },
                orderBy: { date: "desc" },
            });

            // Get completed tasks that don't have daily work records
            let completedTasksWhere = { status: "completed" };
            if (startDate && endDate) {
                // Get tasks that were either created or completed within the date range
                completedTasksWhere.OR = [
                    {
                        createdAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    },
                    {
                        updatedAt: {
                            gte: new Date(startDate),
                            lte: new Date(endDate),
                        },
                    },
                ];
            }

            const completedTasks = await prisma.task.findMany({
                where: completedTasksWhere,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    status: true,
                    updatedAt: true,
                    createdAt: true,
                },
                orderBy: { updatedAt: "desc" },
            });

            // Filter out completed tasks that already have daily work records
            const tasksWithWork = new Set(dailyWork.map((dw) => dw.taskId));
            const completedTasksWithoutWork = completedTasks.filter(
                (task) => !tasksWithWork.has(task.id)
            );

            // Combine the results
            const workHistory = [
                ...dailyWork,
                ...completedTasksWithoutWork.map((task) => ({
                    id: `completed-${task.id}`,
                    taskId: task.id,
                    date: task.updatedAt.toISOString().split("T")[0],
                    totalTime: 0,
                    task: {
                        id: task.id,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                    },
                })),
            ];

            return res.status(200).json(workHistory);
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Failed to fetch work history" });
        }
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
