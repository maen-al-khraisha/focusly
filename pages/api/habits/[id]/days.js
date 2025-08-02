import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "PUT") {
        try {
            const { day, completed } = req.body;
            
            // Upsert the habit day (create if doesn't exist, update if exists)
            const habitDay = await prisma.habitDay.upsert({
                where: {
                    habitId_day: {
                        habitId: parseInt(id),
                        day: parseInt(day),
                    },
                },
                update: {
                    completed: completed,
                },
                create: {
                    habitId: parseInt(id),
                    day: parseInt(day),
                    completed: completed,
                },
            });
            
            res.status(200).json(habitDay);
        } catch (error) {
            console.error("Error updating habit day:", error);
            res.status(500).json({ error: "Failed to update habit day" });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} 