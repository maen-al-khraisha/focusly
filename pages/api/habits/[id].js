import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        try {
            const { name, period, categoryId, icon } = req.body;
            const habit = await prisma.habit.update({
                where: { id: parseInt(id) },
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
            res.status(200).json(habit);
        } catch (error) {
            console.error("Error updating habit:", error);
            res.status(500).json({ error: "Failed to update habit" });
        }
    } else if (req.method === "DELETE") {
        try {
            await prisma.habit.delete({
                where: { id: parseInt(id) },
            });
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting habit:", error);
            res.status(500).json({ error: "Failed to delete habit" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 