import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const sheet = await prisma.agendaSheet.findUnique({
                where: { id: parseInt(id) },
                include: {
                    columns: {
                        orderBy: { order: "asc" }
                    },
                    rows: {
                        include: {
                            cells: {
                                include: {
                                    column: true
                                }
                            }
                        },
                        orderBy: { createdAt: "desc" }
                    }
                }
            });

            if (!sheet) {
                return res.status(404).json({ error: "Agenda sheet not found" });
            }

            return res.status(200).json(sheet);
        } catch (error) {
            console.error("Error fetching agenda sheet:", error);
            return res.status(500).json({ error: "Failed to fetch agenda sheet" });
        }
    }

    if (req.method === "PUT") {
        try {
            const { name, description, icon } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Sheet name is required" });
            }

            const sheet = await prisma.agendaSheet.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    description,
                    icon: icon || "FileText"
                },
                include: {
                    columns: {
                        orderBy: { order: "asc" }
                    }
                }
            });

            return res.status(200).json(sheet);
        } catch (error) {
            console.error("Error updating agenda sheet:", error);
            return res.status(500).json({ error: "Failed to update agenda sheet" });
        }
    }

    if (req.method === "DELETE") {
        try {
            await prisma.agendaSheet.delete({
                where: { id: parseInt(id) }
            });

            return res.status(204).end();
        } catch (error) {
            console.error("Error deleting agenda sheet:", error);
            return res.status(500).json({ error: "Failed to delete agenda sheet" });
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 