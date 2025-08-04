"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Plus,
    FolderOpen,
    BookOpen,
    Edit,
    CheckSquare,
    Target,
    Clock,
    Play,
    Pause,
    Trash2,
    RotateCcw,
    Heart,
    Dumbbell,
    Coffee,
    Brain,
    Music,
    Camera,
    Palette,
    Code,
    Globe,
    Home,
    Car,
    Plane,
    Gamepad2,
    Utensils,
    ShoppingBag,
    Gift,
    Star,
    Zap,
    Moon,
    Sun,
    Cloud,
    Leaf,
} from "lucide-react";
import IconSelector from "./IconSelector";

// Icon map for category selection
const iconMap = {
    FolderOpen,
    BookOpen,
    Edit,
    CheckSquare,
    Target,
    Clock,
    Play,
    Pause,
    Trash2,
    RotateCcw,
    Heart,
    Dumbbell,
    Coffee,
    Brain,
    Music,
    Camera,
    Palette,
    Code,
    Globe,
    Home,
    Car,
    Plane,
    Gamepad2,
    Utensils,
    ShoppingBag,
    Gift,
    Star,
    Zap,
    Moon,
    Sun,
    Cloud,
    Leaf,
};

export default function AddNoteDialog({
    isDialogOpen,
    setIsDialogOpen,
    editingNote,
    setEditingNote,
    newNote,
    setNewNote,
    categories,
    handleAddNote,
    handleUpdateNote,
    handleCategoryChange,
    isCreatingNewCategory,
    setIsCreatingNewCategory,
    newCategoryName,
    setNewCategoryName,
    newCategory,
    setNewCategory,
    setCategories,
}) {
    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                    setEditingNote(null);
                    setNewNote({
                        title: "",
                        content: "",
                        category: "",
                    });
                }
            }}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Note
                </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>
                        {editingNote ? "Edit Note" : "Add New Note"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingNote
                            ? "Update your note content."
                            : "Create a new note to capture your thoughts and ideas."}
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='title'>Note Title</Label>
                        <Input
                            id='title'
                            value={newNote.title}
                            onChange={(e) =>
                                setNewNote({
                                    ...newNote,
                                    title: e.target.value,
                                })
                            }
                            placeholder='Enter note title...'
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='content'>Content</Label>
                        <Textarea
                            id='content'
                            value={newNote.content}
                            onChange={(e) =>
                                setNewNote({
                                    ...newNote,
                                    content: e.target.value,
                                })
                            }
                            placeholder='Write your note content here...'
                            rows={8}
                        />
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='note-category'>
                            Category (Optional)
                        </Label>
                        <Select
                            value={newNote.category}
                            onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select category (optional)' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='none'>
                                    No Category
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.name}
                                        value={category.name}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                                <SelectItem value='create-new'>
                                    + Create New Category
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {isCreatingNewCategory && (
                            <div className='space-y-2'>
                                <Input
                                    placeholder='Enter category name'
                                    value={newCategoryName}
                                    onChange={(e) =>
                                        setNewCategoryName(e.target.value)
                                    }
                                />
                                <div className='grid gap-2'>
                                    <Label>Category Icon</Label>
                                    <IconSelector
                                        iconMap={iconMap}
                                        selectedIcon={newCategory.icon}
                                        onIconSelect={(icon) =>
                                            setNewCategory({
                                                ...newCategory,
                                                icon,
                                            })
                                        }
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <Button
                                        size='sm'
                                        onClick={async () => {
                                            if (newCategoryName.trim()) {
                                                const categoryData = {
                                                    name: newCategoryName,
                                                    icon: newCategory.icon,
                                                };
                                                try {
                                                    const response =
                                                        await fetch(
                                                            "/api/note-categories",
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                                body: JSON.stringify(
                                                                    categoryData
                                                                ),
                                                            }
                                                        );
                                                    if (response.ok) {
                                                        const createdCategory =
                                                            await response.json();
                                                        setCategories([
                                                            ...categories,
                                                            createdCategory,
                                                        ]);
                                                        setNewNote({
                                                            ...newNote,
                                                            category:
                                                                createdCategory.name,
                                                        });
                                                        setIsCreatingNewCategory(
                                                            false
                                                        );
                                                        setNewCategoryName("");
                                                        setNewCategory({
                                                            name: "",
                                                            icon: "FolderOpen",
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error(
                                                        "Error creating category:",
                                                        error
                                                    );
                                                }
                                            }
                                        }}
                                        disabled={!newCategoryName.trim()}>
                                        Create Category
                                    </Button>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() => {
                                            setIsCreatingNewCategory(false);
                                            setNewCategoryName("");
                                            setNewCategory({
                                                name: "",
                                                icon: "FolderOpen",
                                            });
                                        }}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => {
                            setIsDialogOpen(false);
                            setEditingNote(null);
                            setNewNote({
                                title: "",
                                content: "",
                                category: "",
                            });
                        }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={editingNote ? handleUpdateNote : handleAddNote}
                        disabled={
                            !newNote.title.trim() && !newNote.content.trim()
                        }>
                        {editingNote ? "Update Note" : "Add Note"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
