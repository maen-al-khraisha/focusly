"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import NoteItem from "./NoteItem";

// Import all icons
import {
    FolderOpen as FolderOpenIcon,
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

const iconMap = {
    FolderOpen: FolderOpenIcon,
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

export default function NotesList({
    notes,
    categories,
    collapsedCategories,
    toggleCategory,
    handleEditNote,
    handleConvertToTask,
    handleDeleteNote,
    formatDate,
}) {
    const groupNotesByCategory = () => {
        const grouped = {};

        // Group notes by category
        notes.forEach((note) => {
            const categoryId = note.category?.id || "uncategorized";
            if (!grouped[categoryId]) {
                grouped[categoryId] = {
                    category: note.category || {
                        name: "Uncategorized",
                        icon: "FolderOpen",
                    },
                    notes: [],
                };
            }
            grouped[categoryId].notes.push(note);
        });

        return grouped;
    };

    const groupedNotes = groupNotesByCategory();
    const categoryIds = Object.keys(groupedNotes);

    return (
        <div className='space-y-6'>
            {categoryIds.map((categoryId) => {
                const group = groupedNotes[categoryId];
                const CategoryIcon =
                    iconMap[group.category.icon] || FolderOpenIcon;

                return (
                    <div key={categoryId} className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <button
                                onClick={() =>
                                    toggleCategory(group.category.name)
                                }
                                className='flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors'>
                                {collapsedCategories[group.category.name] ? (
                                    <ChevronRight className='h-5 w-5' />
                                ) : (
                                    <ChevronDown className='h-5 w-5' />
                                )}
                                <CategoryIcon className='h-5 w-5 text-blue-600' />
                                {group.category.name}
                                <Badge variant='secondary' className='ml-2'>
                                    {group.notes.length} note
                                    {group.notes.length !== 1 ? "s" : ""}
                                </Badge>
                            </button>
                        </div>

                        {!collapsedCategories[group.category.name] && (
                            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                {group.notes.map((note) => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                        handleEditNote={handleEditNote}
                                        handleConvertToTask={
                                            handleConvertToTask
                                        }
                                        handleDeleteNote={handleDeleteNote}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Show empty categories */}
            {categories
                .filter((category) => !groupedNotes[category.id])
                .map((category) => {
                    const CategoryIcon =
                        iconMap[category.icon] || FolderOpenIcon;
                    return (
                        <div key={category.id} className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 text-lg font-semibold text-gray-500'>
                                    <ChevronRight className='h-5 w-5' />
                                    <CategoryIcon className='h-5 w-5 text-gray-400' />
                                    {category.name}
                                    <Badge variant='secondary' className='ml-2'>
                                        0 notes
                                    </Badge>
                                </div>
                            </div>
                            <div className='text-center py-8 text-gray-500'>
                                <FolderOpen className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                                <p>No notes in this category yet</p>
                                <p className='text-sm'>
                                    Add a note to get started
                                </p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
