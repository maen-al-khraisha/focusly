import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { year, month } = req.query;
            
            let whereClause = {};
            if (year && month) {
                const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                const endDate = new Date(parseInt(year), parseInt(month), 0);
                
                whereClause.date = {
                    gte: startDate,
                    lte: endDate
                };
            }

            const events = await prisma.calendarEvent.findMany({
                where: whereClause,
                orderBy: [
                    { date: "asc" },
                    { time: "asc" }
                ]
            });

            return res.status(200).json(events);
        } catch (error) {
            console.error("Error fetching calendar events:", error);
            return res.status(500).json({ error: "Failed to fetch calendar events" });
        }
    }

    if (req.method === "POST") {
        try {
            const { name, description, link, time, date } = req.body;

            if (!name || !date) {
                return res.status(400).json({ error: "Name and date are required" });
            }

            const event = await prisma.calendarEvent.create({
                data: {
                    name,
                    description,
                    link,
                    time,
                    date: new Date(date)
                }
            });

            return res.status(201).json(event);
        } catch (error) {
            console.error("Error creating calendar event:", error);
            return res.status(500).json({ error: "Failed to create calendar event" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 