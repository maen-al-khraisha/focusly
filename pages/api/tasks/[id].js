import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;
    if (req.method === "GET") {
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
        });
        if (!task) return res.status(404).json({ error: "Task not found" });
        return res.status(200).json(task);
    }
    if (req.method === "PUT") {
        const { title, description, status } = req.body;
        try {
            const task = await prisma.task.update({
                where: { id: Number(id) },
                data: { title, description, status },
            });
            return res.status(200).json(task);
        } catch (e) {
            return res.status(404).json({ error: "Task not found" });
        }
    }
    if (req.method === "DELETE") {
        try {
            await prisma.task.delete({ where: { id: Number(id) } });
            return res.status(204).end();
        } catch (e) {
            return res.status(404).json({ error: "Task not found" });
        }
    }
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
