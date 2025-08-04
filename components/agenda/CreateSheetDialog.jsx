"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, X, Save } from "lucide-react";

export default function CreateSheetDialog({
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    newSheet,
    setNewSheet,
    createSheet,
}) {
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

    return (
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
                                        onClick={() => removeColumn(index)}>
                                        <X className='h-3 w-3' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setIsCreateDialogOpen(false)}>
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
    );
}
