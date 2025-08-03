"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    FileText,
    Eye,
    Edit,
    Trash2,
    X,
    Save,
    Calendar,
    User,
    Lock,
    Mail,
    Phone,
    MapPin,
    ShoppingCart,
    Package,
    DollarSign,
    Hash,
    Clock,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

const iconMap = {
    FileText: FileText,
    Calendar: Calendar,
    User: User,
    Lock: Lock,
    Mail: Mail,
    Phone: Phone,
    MapPin: MapPin,
    ShoppingCart: ShoppingCart,
    Package: Package,
    DollarSign: DollarSign,
    Hash: Hash,
    Clock: Clock,
};

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

    const addColumn = () => {
        setNewSheet({
            ...newSheet,
            columns: [
                ...newSheet.columns,
                { name: "", type: "text", required: false },
            ],
        });
    };

    const removeColumn = (index) => {
        setNewSheet({
            ...newSheet,
            columns: newSheet.columns.filter((_, i) => i !== index),
        });
    };

    const updateColumn = (index, field, value) => {
        const updatedColumns = [...newSheet.columns];
        updatedColumns[index] = { ...updatedColumns[index], [field]: value };
        setNewSheet({ ...newSheet, columns: updatedColumns });
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

    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName] || FileText;
        return <IconComponent className='h-4 w-4' />;
    };

    const getColumnTypeIcon = (type) => {
        switch (type) {
            case "email":
                return <Mail className='h-3 w-3' />;
            case "phone":
                return <Phone className='h-3 w-3' />;
            case "url":
                return <Hash className='h-3 w-3' />;
            case "date":
                return <Calendar className='h-3 w-3' />;
            case "number":
                return <Hash className='h-3 w-3' />;
            default:
                return <FileText className='h-3 w-3' />;
        }
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

    return (
        <div className='p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold'>Agenda</h1>
                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className='h-4 w-4 mr-2' />
                            Create Sheet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                        <DialogHeader>
                            <DialogTitle>Create New Sheet</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4'>
                            <div>
                                <label className='text-sm font-medium'>
                                    Sheet Name
                                </label>
                                <Input
                                    value={newSheet.name}
                                    onChange={(e) =>
                                        setNewSheet({
                                            ...newSheet,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder='e.g., Passwords, Contacts, Inventory'
                                />
                            </div>
                            <div>
                                <div className='flex justify-between items-center mb-2'>
                                    <label className='text-sm font-medium'>
                                        Columns
                                    </label>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={addColumn}>
                                        <Plus className='h-3 w-3 mr-1' />
                                        Add Column
                                    </Button>
                                </div>
                                <div className='space-y-2'>
                                    {newSheet.columns.map((column, index) => (
                                        <div
                                            key={index}
                                            className='flex gap-2 items-center'>
                                            <Input
                                                placeholder='Column name'
                                                value={column.name}
                                                onChange={(e) =>
                                                    updateColumn(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Select
                                                value={column.type}
                                                onValueChange={(value) =>
                                                    updateColumn(
                                                        index,
                                                        "type",
                                                        value
                                                    )
                                                }>
                                                <SelectTrigger className='w-32'>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='text'>
                                                        Text
                                                    </SelectItem>
                                                    <SelectItem value='email'>
                                                        Email
                                                    </SelectItem>
                                                    <SelectItem value='phone'>
                                                        Phone
                                                    </SelectItem>
                                                    <SelectItem value='url'>
                                                        URL
                                                    </SelectItem>
                                                    <SelectItem value='date'>
                                                        Date
                                                    </SelectItem>
                                                    <SelectItem value='number'>
                                                        Number
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                size='sm'
                                                onClick={() =>
                                                    removeColumn(index)
                                                }>
                                                <X className='h-3 w-3' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex justify-end gap-2'>
                                <Button
                                    variant='outline'
                                    onClick={() =>
                                        setIsCreateDialogOpen(false)
                                    }>
                                    Cancel
                                </Button>
                                <Button onClick={createSheet}>
                                    <Save className='h-4 w-4 mr-2' />
                                    Create Sheet
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className='text-center py-8'>
                    <p>Loading agenda sheets...</p>
                </div>
            ) : sheets.length === 0 ? (
                <div className='text-center py-8'>
                    <p className='text-gray-500'>
                        No sheets created yet. Create your first sheet to get
                        started!
                    </p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {sheets.map((sheet) => (
                        <Card key={sheet.id}>
                            <CardHeader className='pb-3'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <div
                                            className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded'
                                            onClick={() =>
                                                toggleSheetCollapse(sheet.id)
                                            }>
                                            {collapsedSheets.has(sheet.id) ? (
                                                <ChevronRight className='h-4 w-4' />
                                            ) : (
                                                <ChevronDown className='h-4 w-4' />
                                            )}
                                            <CardTitle className='flex items-center gap-2'>
                                                {getIconComponent(sheet.icon)}
                                                {sheet.name}
                                            </CardTitle>
                                            <div className='flex gap-1'>
                                                <Badge variant='outline'>
                                                    {sheet.rows?.length || 0}{" "}
                                                    rows
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedSheet(sheet)}
                                        size='sm'>
                                        <Plus className='h-4 w-4 mr-2' />
                                        Add Row
                                    </Button>
                                </div>
                            </CardHeader>
                            {!collapsedSheets.has(sheet.id) && (
                                <CardContent className='pt-0'>
                                    <div className='overflow-x-auto'>
                                        <table className='w-full rounded-lg overflow-hidden'>
                                            <thead>
                                                <tr
                                                    className='border-b'
                                                    style={{
                                                        borderRadius: "20px",
                                                    }}>
                                                    {sheet.columns?.map(
                                                        (column) => (
                                                            <th
                                                                key={column.id}
                                                                className='text-left p-3 font-bold'
                                                                style={{
                                                                    color: "#fff3b0",
                                                                    backgroundColor:
                                                                        "#335c67",
                                                                }}>
                                                                <div className='flex items-center gap-2'>
                                                                    {getColumnTypeIcon(
                                                                        column.type
                                                                    )}
                                                                    {
                                                                        column.name
                                                                    }
                                                                </div>
                                                            </th>
                                                        )
                                                    )}
                                                    <th
                                                        className='text-left p-3 font-bold'
                                                        style={{
                                                            color: "#fff3b0",
                                                            backgroundColor:
                                                                "#335c67",
                                                        }}>
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sheet.rows?.length > 0 ? (
                                                    sheet.rows.map((row) => (
                                                        <tr
                                                            key={row.id}
                                                            className='border-b hover:bg-gray-50'>
                                                            {sheet.columns?.map(
                                                                (column) => {
                                                                    const cell =
                                                                        row.cells?.find(
                                                                            (
                                                                                c
                                                                            ) =>
                                                                                c.columnId ===
                                                                                column.id
                                                                        );
                                                                    return (
                                                                        <td
                                                                            key={
                                                                                column.id
                                                                            }
                                                                            className='p-3'>
                                                                            {cell?.value ||
                                                                                ""}
                                                                        </td>
                                                                    );
                                                                }
                                                            )}
                                                            <td className='p-3'>
                                                                <div className='flex gap-2'>
                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        onClick={() =>
                                                                            handleEditRow(
                                                                                sheet.id,
                                                                                row
                                                                            )
                                                                        }
                                                                        className='h-8 w-8 p-0'>
                                                                        <Edit className='h-3 w-3' />
                                                                    </Button>
                                                                    <Button
                                                                        size='sm'
                                                                        variant='outline'
                                                                        onClick={() =>
                                                                            handleDeleteRow(
                                                                                sheet.id,
                                                                                row.id
                                                                            )
                                                                        }
                                                                        className='h-8 w-8 p-0 text-red-600 hover:text-red-700'>
                                                                        <Trash2 className='h-3 w-3' />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={
                                                                (sheet.columns
                                                                    ?.length ||
                                                                    1) + 1
                                                            }
                                                            className='p-4 text-center text-gray-500'>
                                                            No data yet. Click
                                                            "Add Row" to add
                                                            your first entry.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Row Dialog */}
            {selectedSheet && (
                <Dialog
                    open={isAddRowDialogOpen}
                    onOpenChange={setIsAddRowDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {isEditing
                                    ? `Edit Row in ${selectedSheet.name}`
                                    : `Add New Row to ${selectedSheet.name}`}
                            </DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4'>
                            {selectedSheet.columns?.map((column) => (
                                <div key={column.id}>
                                    <label className='text-sm font-medium flex items-center gap-2'>
                                        {getColumnTypeIcon(column.type)}
                                        {column.name}
                                        {column.required && (
                                            <span className='text-red-500'>
                                                *
                                            </span>
                                        )}
                                    </label>
                                    <Input
                                        type={
                                            column.type === "email"
                                                ? "email"
                                                : column.type === "number"
                                                ? "number"
                                                : "text"
                                        }
                                        value={newRow[column.id] || ""}
                                        onChange={(e) =>
                                            setNewRow({
                                                ...newRow,
                                                [column.id]: e.target.value,
                                            })
                                        }
                                        placeholder={`Enter ${column.name.toLowerCase()}`}
                                    />
                                </div>
                            ))}
                            <div className='flex justify-end gap-2'>
                                <Button
                                    variant='outline'
                                    onClick={() =>
                                        setIsAddRowDialogOpen(false)
                                    }>
                                    Cancel
                                </Button>
                                <Button onClick={addRow}>
                                    <Save className='h-4 w-4 mr-2' />
                                    {isEditing ? "Update Row" : "Add Row"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
