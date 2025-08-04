"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Save, FileText, Mail, Phone, Hash, Calendar } from "lucide-react";

export default function AddRowDialog({
    selectedSheet,
    isAddRowDialogOpen,
    setIsAddRowDialogOpen,
    newRow,
    setNewRow,
    addRow,
    isEditing,
}) {
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

    if (!selectedSheet) return null;

    return (
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
                                    <span className='text-red-500'>*</span>
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
                            onClick={() => setIsAddRowDialogOpen(false)}>
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
    );
}
