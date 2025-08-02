import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        try {
            const { name, icon } = req.body;
            const category = await prisma.noteCategory.update({
                where: { id: parseInt(id) },
                data: { name, icon },
            });
            res.status(200).json(category);
        } catch (error) {
            console.error("Error updating note category:", error);
            res.status(500).json({ error: "Failed to update note category" });
        }
    } else if (req.method === "DELETE") {
        try {
            await prisma.noteCategory.delete({
                where: { id: parseInt(id) },
            });
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting note category:", error);
            res.status(500).json({ error: "Failed to delete note category" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 