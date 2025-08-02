import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const habits = await prisma.habit.findMany({
                include: {
                    category: true,
                    days: {
                        orderBy: { day: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            res.status(200).json(habits);
        } catch (error) {
            console.error("Error fetching habits:", error);
            res.status(500).json({ error: "Failed to fetch habits" });
        }
    } else if (req.method === "POST") {
        try {
            const { name, period, categoryId, icon } = req.body;
            const habit = await prisma.habit.create({
                data: { 
                    name, 
                    period, 
                    icon: icon || "Target",
                    categoryId: categoryId || null 
                },
                include: {
                    category: true,
                    days: true,
                },
            });
            res.status(201).json(habit);
        } catch (error) {
            console.error("Error creating habit:", error);
            res.status(500).json({ error: "Failed to create habit" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 