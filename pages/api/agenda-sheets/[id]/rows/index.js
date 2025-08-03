import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "POST") {
        try {
            const { cells } = req.body;

            if (!cells || !Array.isArray(cells)) {
                return res.status(400).json({ error: "Cells data is required" });
            }

            // Create the row and all its cells in a transaction
            const row = await prisma.agendaRow.create({
                data: {
                    sheetId: parseInt(id),
                    cells: {
                        create: cells.map(cell => ({
                            columnId: cell.columnId,
                            value: cell.value || ""
                        }))
                    }
                },
                include: {
                    cells: {
                        include: {
                            column: true
                        }
                    }
                }
            });

            return res.status(201).json(row);
        } catch (error) {
            console.error("Error adding row to agenda sheet:", error);
            return res.status(500).json({ error: "Failed to add row to agenda sheet" });
        }
    }

    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 