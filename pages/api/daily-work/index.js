import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { startDate, endDate, taskId } = req.query;
            let whereClause = {};
            if (startDate && endDate) {
                whereClause.date = {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                };
            }
            if (taskId) {
                whereClause.taskId = parseInt(taskId);
            }
            const dailyWork = await prisma.dailyWork.findMany({
                where: whereClause,
                include: {
                    task: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                        },
                    },
                },
                orderBy: { date: "desc" },
            });
            return res.status(200).json(dailyWork);
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Failed to fetch daily work" });
        }
    }
    if (req.method === "POST") {
        try {
            const { taskId, date, totalTime } = req.body;
            if (!taskId || !date || totalTime === undefined) {
                return res.status(400).json({
                    error: "taskId, date, and totalTime are required",
                });
            }
            const dailyWork = await prisma.dailyWork.upsert({
                where: {
                    taskId_date: {
                        taskId: parseInt(taskId),
                        date: new Date(date),
                    },
                },
                update: {
                    totalTime: {
                        increment: parseInt(totalTime),
                    },
                },
                create: {
                    taskId: parseInt(taskId),
                    date: new Date(date),
                    totalTime: parseInt(totalTime),
                },
            });
            return res.status(201).json(dailyWork);
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Failed to create/update daily work" });
        }
    }
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
