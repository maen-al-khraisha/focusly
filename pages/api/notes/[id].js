import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        try {
            const { title, content, categoryId } = req.body;
            const note = await prisma.note.update({
                where: { id: parseInt(id) },
                data: { 
                    title, 
                    content, 
                    categoryId: categoryId || null 
                },
                include: {
                    category: true,
                },
            });
            res.status(200).json(note);
        } catch (error) {
            console.error("Error updating note:", error);
            res.status(500).json({ error: "Failed to update note" });
        }
    } else if (req.method === "DELETE") {
        try {
            await prisma.note.delete({
                where: { id: parseInt(id) },
            });
            res.status(204).end();
        } catch (error) {
            console.error("Error deleting note:", error);
            res.status(500).json({ error: "Failed to delete note" });
        }
    } else {
        res.setHeader("Allow", ["PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 