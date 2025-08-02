import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const categories = await prisma.noteCategory.findMany({
                orderBy: { name: "asc" },
            });
            res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching note categories:", error);
            res.status(500).json({ error: "Failed to fetch note categories" });
        }
    } else if (req.method === "POST") {
        try {
            const { name, icon } = req.body;
            const category = await prisma.noteCategory.create({
                data: { name, icon },
            });
            res.status(201).json(category);
        } catch (error) {
            console.error("Error creating note category:", error);
            res.status(500).json({ error: "Failed to create note category" });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 