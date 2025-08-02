import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const notes = await prisma.note.findMany({
                include: {
                    category: true,
                },
                orderBy: { createdAt: "desc" },
            });
            res.status(200).json(notes);
        } catch (error) {
            console.error("Error fetching notes:", error);
            res.status(500).json({ error: "Failed to fetch notes" });
        }
    } else if (req.method === "POST") {
        try {
            const { title, content, categoryId } = req.body;
            const note = await prisma.note.create({
                data: { 
                    title, 
                    content, 
                    categoryId: categoryId || null 
                },
                include: {
                    category: true,
                },
            });
            res.status(201).json(note);
        } catch (error) {
            console.error("Error creating note:", error);
            res.status(500).json({ error: "Failed to create note" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 