import { PrismaClient } from "../../../lib/generated/prisma";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { completed } = req.query;
        const where = {};
        if (completed !== undefined) {
            where.completed = completed === "true";
        }
        const tasks = await prisma.task.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return res.status(200).json(tasks);
    }
    if (req.method === "POST") {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        const task = await prisma.task.create({
            data: { title, description, completed: false },
        });
        return res.status(201).json(task);
    }
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
