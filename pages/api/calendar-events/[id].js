import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const event = await prisma.calendarEvent.findUnique({
                where: { id: parseInt(id) }
            });

            if (!event) {
                return res.status(404).json({ error: "Calendar event not found" });
            }

            return res.status(200).json(event);
        } catch (error) {
            console.error("Error fetching calendar event:", error);
            return res.status(500).json({ error: "Failed to fetch calendar event" });
        }
    }

    if (req.method === "PUT") {
        try {
            const { name, description, link, time, date } = req.body;

            if (!name || !date) {
                return res.status(400).json({ error: "Name and date are required" });
            }

            const event = await prisma.calendarEvent.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    description,
                    link,
                    time,
                    date: new Date(date)
                }
            });

            return res.status(200).json(event);
        } catch (error) {
            console.error("Error updating calendar event:", error);
            return res.status(500).json({ error: "Failed to update calendar event" });
        }
    }

    if (req.method === "DELETE") {
        try {
            await prisma.calendarEvent.delete({
                where: { id: parseInt(id) }
            });

            return res.status(204).end();
        } catch (error) {
            console.error("Error deleting calendar event:", error);
            return res.status(500).json({ error: "Failed to delete calendar event" });
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 