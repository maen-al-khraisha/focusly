"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    Clock
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
    Clock: Clock
};

export default function AgendaPage() {
    const [sheets, setSheets] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false);
    const [newSheet, setNewSheet] = useState({
        name: "",
        description: "",
        icon: "FileText",
        columns: []
    });
    const [newRow, setNewRow] = useState({});

    useEffect(() => {
        fetchSheets();
    }, []);

    const fetchSheets = async () => {
        try {
            const response = await axios.get("/api/agenda-sheets");
            setSheets(response.data);
        } catch (error) {
            console.error("Error fetching sheets:", error);
        }
    };

    const createSheet = async () => {
        try {
            const response = await axios.post("/api/agenda-sheets", newSheet);
            setSheets([response.data, ...sheets]);
            setNewSheet({ name: "", description: "", icon: "FileText", columns: [] });
            setIsCreateDialogOpen(false);
        } catch (error) {
            console.error("Error creating sheet:", error);
        }
    };

    const addColumn = () => {
        setNewSheet({
            ...newSheet,
            columns: [...newSheet.columns, { name: "", type: "text", required: false }]
        });
    };

    const removeColumn = (index) => {
        setNewSheet({
            ...newSheet,
            columns: newSheet.columns.filter((_, i) => i !== index)
        });
    };

    const updateColumn = (index, field, value) => {
        const updatedColumns = [...newSheet.columns];
        updatedColumns[index] = { ...updatedColumns[index], [field]: value };
        setNewSheet({ ...newSheet, columns: updatedColumns });
    };

    const addRow = async () => {
        try {
            const cells = selectedSheet.columns.map(column => ({
                columnId: column.id,
                value: newRow[column.id] || ""
            }));

            await axios.post(`/api/agenda-sheets/${selectedSheet.id}/rows`, { cells });
            
            // Refresh the selected sheet
            const response = await axios.get(`/api/agenda-sheets/${selectedSheet.id}`);
            setSelectedSheet(response.data);
            setNewRow({});
            setIsAddRowDialogOpen(false);
        } catch (error) {
            console.error("Error adding row:", error);
        }
    };

    const getIconComponent = (iconName) => {
        const IconComponent = iconMap[iconName] || FileText;
        return <IconComponent className="h-4 w-4" />;
    };

    const getColumnTypeIcon = (type) => {
        switch (type) {
            case "email": return <Mail className="h-3 w-3" />;
            case "phone": return <Phone className="h-3 w-3" />;
            case "url": return <Hash className="h-3 w-3" />;
            case "date": return <Calendar className="h-3 w-3" />;
            case "number": return <Hash className="h-3 w-3" />;
            default: return <FileText className="h-3 w-3" />;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Agenda</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Sheet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Sheet</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Sheet Name</label>
                                <Input
                                    value={newSheet.name}
                                    onChange={(e) => setNewSheet({ ...newSheet, name: e.target.value })}
                                    placeholder="e.g., Passwords, Contacts, Inventory"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    value={newSheet.description}
                                    onChange={(e) => setNewSheet({ ...newSheet, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Icon</label>
                                <Select value={newSheet.icon} onValueChange={(value) => setNewSheet({ ...newSheet, icon: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FileText">Document</SelectItem>
                                        <SelectItem value="Lock">Passwords</SelectItem>
                                        <SelectItem value="User">Contacts</SelectItem>
                                        <SelectItem value="Package">Inventory</SelectItem>
                                        <SelectItem value="Calendar">Events</SelectItem>
                                        <SelectItem value="ShoppingCart">Shopping</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium">Columns</label>
                                    <Button type="button" variant="outline" size="sm" onClick={addColumn}>
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Column
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {newSheet.columns.map((column, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Input
                                                placeholder="Column name"
                                                value={column.name}
                                                onChange={(e) => updateColumn(index, "name", e.target.value)}
                                            />
                                            <Select value={column.type} onValueChange={(value) => updateColumn(index, "type", value)}>
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="email">Email</SelectItem>
                                                    <SelectItem value="phone">Phone</SelectItem>
                                                    <SelectItem value="url">URL</SelectItem>
                                                    <SelectItem value="date">Date</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeColumn(index)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={createSheet}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Sheet
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {!selectedSheet ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sheets.map((sheet) => (
                        <Card key={sheet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {getIconComponent(sheet.icon)}
                                    {sheet.name}
                                </CardTitle>
                                {sheet.description && (
                                    <p className="text-sm text-gray-600">{sheet.description}</p>
                                )}
                                <div className="flex gap-1">
                                    <Badge variant="secondary">{sheet.columns.length} columns</Badge>
                                    <Badge variant="outline">{sheet.rows.length} rows</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={() => setSelectedSheet(sheet)}
                                    className="w-full"
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Sheet
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setSelectedSheet(null)}>
                                ← Back
                            </Button>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                {getIconComponent(selectedSheet.icon)}
                                {selectedSheet.name}
                            </h2>
                        </div>
                        <Dialog open={isAddRowDialogOpen} onOpenChange={setIsAddRowDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Row
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Row</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    {selectedSheet.columns.map((column) => (
                                        <div key={column.id}>
                                            <label className="text-sm font-medium flex items-center gap-2">
                                                {getColumnTypeIcon(column.type)}
                                                {column.name}
                                                {column.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <Input
                                                type={column.type === "email" ? "email" : column.type === "number" ? "number" : "text"}
                                                value={newRow[column.id] || ""}
                                                onChange={(e) => setNewRow({ ...newRow, [column.id]: e.target.value })}
                                                placeholder={`Enter ${column.name.toLowerCase()}`}
                                            />
                                        </div>
                                    ))}
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsAddRowDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={addRow}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Add Row
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            {selectedSheet.columns.map((column) => (
                                                <th key={column.id} className="text-left p-3 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {getColumnTypeIcon(column.type)}
                                                        {column.name}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedSheet.rows.map((row) => (
                                            <tr key={row.id} className="border-b hover:bg-gray-50">
                                                {selectedSheet.columns.map((column) => {
                                                    const cell = row.cells.find(c => c.columnId === column.id);
                                                    return (
                                                        <td key={column.id} className="p-3">
                                                            {cell?.value || ""}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
