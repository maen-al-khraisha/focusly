import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const sheets = await prisma.agendaSheet.findMany({
                include: {
                    columns: {
                        orderBy: { order: "asc" },
                    },
                    rows: {
                        include: {
                            cells: {
                                include: {
                                    column: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            return res.status(200).json(sheets);
        } catch (error) {
            console.error("Error fetching agenda sheets:", error);
            return res
                .status(500)
                .json({ error: "Failed to fetch agenda sheets" });
        }
    }

    if (req.method === "POST") {
        try {
            const { name, description, icon, columns } = req.body;

            if (!name) {
                return res
                    .status(400)
                    .json({ error: "Sheet name is required" });
            }

            const sheet = await prisma.agendaSheet.create({
                data: {
                    name,
                    description: null,
                    icon: "FileText",
                    columns: {
                        create:
                            columns?.map((col, index) => ({
                                name: col.name,
                                type: col.type || "text",
                                order: col.order || index,
                                required: col.required || false,
                            })) || [],
                    },
                },
                include: {
                    columns: {
                        orderBy: { order: "asc" },
                    },
                },
            });

            return res.status(201).json(sheet);
        } catch (error) {
            console.error("Error creating agenda sheet:", error);
            return res
                .status(500)
                .json({ error: "Failed to create agenda sheet" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
