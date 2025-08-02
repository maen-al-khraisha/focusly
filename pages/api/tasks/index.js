import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { status } = req.query;
        const where = {};
        if (status !== undefined) {
            where.status = status;
        }
        const tasks = await prisma.task.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(tasks);
    } else if (req.method === "POST") {
        try {
            const { title, description, icon, categoryId } = req.body;
            const task = await prisma.task.create({
                data: {
                    title,
                    description,
                    icon: icon || "Target",
                    status: "active",
                    categoryId: categoryId || null,
                },
                include: {
                    category: true,
                },
            });
            res.status(201).json(task);
        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ error: "Failed to create task" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
