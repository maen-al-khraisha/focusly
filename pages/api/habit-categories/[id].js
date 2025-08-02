import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        try {
            const { name, icon } = req.body;
            const category = await prisma.habitCategory.update({
                where: { id: parseInt(id) },
                data: { name, icon },
            });
            res.status(200).json(category);
        } catch (error) {
            console.error("Error updating habit category:", error);
            res.status(500).json({ error: "Failed to update habit category" });
        }
    } else if (req.method === "DELETE") {
        try {
            await prisma.habitCategory.delete({
                where: { id: parseInt(id) },
            });
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting habit category:", error);
            res.status(500).json({ error: "Failed to delete habit category" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 