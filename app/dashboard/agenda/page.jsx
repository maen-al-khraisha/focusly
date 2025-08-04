"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AgendaSkeleton from "@/components/skeletons/AgendaSkeleton";
import CreateSheetDialog from "@/components/agenda/CreateSheetDialog";
import AddRowDialog from "@/components/agenda/AddRowDialog";
import AgendaSheet from "@/components/agenda/AgendaSheet";
import EmptyState from "@/components/agenda/EmptyState";

export default function AgendaPage() {
    const [sheets, setSheets] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [collapsedSheets, setCollapsedSheets] = useState(new Set());
    const [isEditing, setIsEditing] = useState(false);
    const [editingRowId, setEditingRowId] = useState(null);
    const [newSheet, setNewSheet] = useState({
        name: "",
        columns: [],
    });
    const [newRow, setNewRow] = useState({});

    useEffect(() => {
        fetchSheets();
    }, []);

    const fetchSheets = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/agenda-sheets");
            setSheets(response.data);
        } catch (error) {
            console.error("Error fetching sheets:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createSheet = async () => {
        try {
            const response = await axios.post("/api/agenda-sheets", newSheet);
            setSheets([response.data, ...sheets]);
            setNewSheet({ name: "", columns: [] });
            setIsCreateDialogOpen(false);
        } catch (error) {
            console.error("Error creating sheet:", error);
        }
    };

    const addRow = async () => {
        try {
            const cells = selectedSheet.columns.map((column) => ({
                columnId: column.id,
                value: newRow[column.id] || "",
            }));

            if (isEditing) {
                // Update existing row
                await axios.put(
                    `/api/agenda-sheets/${selectedSheet.id}/rows/${editingRowId}`,
                    {
                        cells,
                    }
                );
            } else {
                // Add new row
                await axios.post(
                    `/api/agenda-sheets/${selectedSheet.id}/rows`,
                    {
                        cells,
                    }
                );
            }

            // Refresh the selected sheet
            const response = await axios.get(
                `/api/agenda-sheets/${selectedSheet.id}`
            );
            setSelectedSheet(response.data);
            setNewRow({});
            setIsAddRowDialogOpen(false);
            setIsEditing(false);
            setEditingRowId(null);
        } catch (error) {
            console.error("Error adding/editing row:", error);
        }
    };

    const toggleSheetCollapse = (sheetId) => {
        const newCollapsed = new Set(collapsedSheets);
        if (newCollapsed.has(sheetId)) {
            newCollapsed.delete(sheetId);
        } else {
            newCollapsed.add(sheetId);
        }
        setCollapsedSheets(newCollapsed);
    };

    const handleEditRow = (sheetId, row) => {
        // Find the sheet from the sheets array
        const sheet = sheets.find((s) => s.id === sheetId);
        setSelectedSheet(sheet);

        // Populate the form with existing row data
        const rowData = row.cells.reduce(
            (acc, cell) => ({
                ...acc,
                [cell.columnId]: cell.value,
            }),
            {}
        );
        setNewRow(rowData);

        setIsAddRowDialogOpen(true);
        setIsEditing(true);
        setEditingRowId(row.id);
    };

    const handleDeleteRow = async (sheetId, rowId) => {
        if (confirm("Are you sure you want to delete this row?")) {
            try {
                await axios.delete(
                    `/api/agenda-sheets/${sheetId}/rows/${rowId}`
                );
                const response = await axios.get(
                    `/api/agenda-sheets/${sheetId}`
                );
                setSelectedSheet(response.data);
            } catch (error) {
                console.error("Error deleting row:", error);
            }
        }
    };

    if (isLoading) {
        return <AgendaSkeleton />;
    }

    return (
        <div className='p-6'>
            <div className='flex justify-end items-center mb-6'>
                <CreateSheetDialog
                    isCreateDialogOpen={isCreateDialogOpen}
                    setIsCreateDialogOpen={setIsCreateDialogOpen}
                    newSheet={newSheet}
                    setNewSheet={setNewSheet}
                    createSheet={createSheet}
                />
            </div>
            {sheets.length === 0 ? (
                <EmptyState />
            ) : (
                <div className='space-y-4'>
                    {sheets.map((sheet) => (
                        <AgendaSheet
                            key={sheet.id}
                            sheet={sheet}
                            collapsedSheets={collapsedSheets}
                            toggleSheetCollapse={toggleSheetCollapse}
                            setSelectedSheet={setSelectedSheet}
                            handleEditRow={handleEditRow}
                            handleDeleteRow={handleDeleteRow}
                        />
                    ))}
                </div>
            )}
            <AddRowDialog
                selectedSheet={selectedSheet}
                isAddRowDialogOpen={isAddRowDialogOpen}
                setIsAddRowDialogOpen={setIsAddRowDialogOpen}
                newRow={newRow}
                setNewRow={setNewRow}
                addRow={addRow}
                isEditing={isEditing}
            />
        </div>
    );
}
