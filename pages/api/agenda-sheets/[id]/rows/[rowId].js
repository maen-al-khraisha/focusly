import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id, rowId } = req.query;

    if (req.method === "DELETE") {
        try {
            // Delete the row (this will cascade delete all cells)
            await prisma.agendaRow.delete({
                where: { id: parseInt(rowId) }
            });

            return res.status(204).end();
        } catch (error) {
            console.error("Error deleting row:", error);
            return res.status(500).json({ error: "Failed to delete row" });
        }
    }

    if (req.method === "PUT") {
        try {
            const { cells } = req.body;

            if (!cells || !Array.isArray(cells)) {
                return res.status(400).json({ error: "Cells data is required" });
            }

            // Delete existing cells and create new ones
            await prisma.agendaCell.deleteMany({
                where: { rowId: parseInt(rowId) }
            });

            // Create new cells
            await prisma.agendaCell.createMany({
                data: cells.map(cell => ({
                    rowId: parseInt(rowId),
                    columnId: cell.columnId,
                    value: cell.value || ""
                }))
            });

            // Get the updated row
            const updatedRow = await prisma.agendaRow.findUnique({
                where: { id: parseInt(rowId) },
                include: {
                    cells: {
                        include: {
                            column: true
                        }
                    }
                }
            });

            return res.status(200).json(updatedRow);
        } catch (error) {
            console.error("Error updating row:", error);
            return res.status(500).json({ error: "Failed to update row" });
        }
    }

    res.setHeader("Allow", ["DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
} 