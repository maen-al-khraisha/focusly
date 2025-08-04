"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings, FolderOpen } from "lucide-react";
import NotesSkeleton from "@/components/skeletons/NotesSkeleton";
import AddNoteDialog from "@/components/notes/AddNoteDialog";
import CategoryManagementDialog from "@/components/notes/CategoryManagementDialog";
import NotesList from "@/components/notes/NotesList";
import EmptyState from "@/components/notes/EmptyState";

export default function Notes() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [newNote, setNewNote] = useState({
        title: "",
        content: "",
        category: "",
    });
    const [notes, setNotes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Category management state
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: "",
        icon: "FolderOpen",
    });
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    // Category editing state
    const [editingCategory, setEditingCategory] = useState(null);
    const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
        useState(false);

    // Note grouping state
    const [collapsedCategories, setCollapsedCategories] = useState({});

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const [notesResponse, categoriesResponse] = await Promise.all([
                fetch("/api/notes"),
                fetch("/api/note-categories"),
            ]);

            if (notesResponse.ok) {
                const notesData = await notesResponse.json();
                setNotes(notesData);
            }

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (newNote.title.trim() || newNote.content.trim()) {
            try {
                const categoryId =
                    newNote.category && newNote.category !== "none"
                        ? categories.find(
                              (cat) => cat.name === newNote.category
                          )?.id
                        : null;

                const response = await fetch("/api/notes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: newNote.title,
                        content: newNote.content,
                        categoryId: categoryId,
                    }),
                });

                if (response.ok) {
                    const createdNote = await response.json();
                    setNotes([createdNote, ...notes]);
                    setNewNote({ title: "", content: "", category: "" });
                    setIsDialogOpen(false);
                }
            } catch (error) {
                console.error("Error creating note:", error);
            }
        }
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setNewNote({
            title: note.title,
            content: note.content,
            category: note.category?.name || "",
        });
        setIsDialogOpen(true);
    };

    const handleUpdateNote = async () => {
        if (newNote.title.trim() || newNote.content.trim()) {
            try {
                const categoryId =
                    newNote.category && newNote.category !== "none"
                        ? categories.find(
                              (cat) => cat.name === newNote.category
                          )?.id
                        : null;

                const response = await fetch(`/api/notes/${editingNote.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: newNote.title,
                        content: newNote.content,
                        categoryId: categoryId,
                    }),
                });

                if (response.ok) {
                    const updatedNote = await response.json();
                    setNotes(
                        notes.map((note) =>
                            note.id === editingNote.id ? updatedNote : note
                        )
                    );
                    setNewNote({ title: "", content: "", category: "" });
                    setEditingNote(null);
                    setIsDialogOpen(false);
                }
            } catch (error) {
                console.error("Error updating note:", error);
            }
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setNotes(notes.filter((note) => note.id !== noteId));
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleConvertToTask = async (note) => {
        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: note.title,
                    description: note.content,
                    categoryId: note.category?.id || null,
                }),
            });

            if (response.ok) {
                setNotes(notes.filter((n) => n.id !== note.id));
                console.log("Note converted to task successfully");
            } else {
                console.error("Failed to convert note to task");
            }
        } catch (error) {
            console.error("Error converting note to task:", error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Category management functions
    const handleAddCategory = async () => {
        if (newCategory.name.trim()) {
            try {
                const response = await fetch("/api/note-categories", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCategory),
                });

                if (response.ok) {
                    const createdCategory = await response.json();
                    setCategories([...categories, createdCategory]);
                    setNewCategory({ name: "", icon: "FolderOpen" });
                    setIsCategoryDialogOpen(false);
                }
            } catch (error) {
                console.error("Error creating category:", error);
            }
        }
    };

    const handleCategoryChange = (value) => {
        if (value === "create-new") {
            setIsCreatingNewCategory(true);
            setNewNote({ ...newNote, category: "" });
        } else {
            setIsCreatingNewCategory(false);
            setNewNote({ ...newNote, category: value === "none" ? "" : value });
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, icon: category.icon });
        setIsEditCategoryDialogOpen(true);
    };

    const handleUpdateCategory = async () => {
        if (newCategory.name.trim()) {
            try {
                const response = await fetch(
                    `/api/note-categories/${editingCategory.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newCategory),
                    }
                );

                if (response.ok) {
                    const updatedCategory = await response.json();
                    setCategories(
                        categories.map((cat) =>
                            cat.id === editingCategory.id
                                ? updatedCategory
                                : cat
                        )
                    );
                    setNewCategory({ name: "", icon: "FolderOpen" });
                    setEditingCategory(null);
                    setIsEditCategoryDialogOpen(false);
                }
            } catch (error) {
                console.error("Error updating category:", error);
            }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`/api/note-categories/${categoryId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setCategories(
                    categories.filter((cat) => cat.id !== categoryId)
                );
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const toggleCategory = (categoryName) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    if (loading) {
        return <NotesSkeleton />;
    }

    return (
        <div className='p-6 space-y-8'>
            <div className='flex items-center justify-end'>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => setIsCategoryDialogOpen(true)}>
                        <Settings className='mr-2 h-4 w-4' />
                        Manage Categories
                    </Button>
                    <AddNoteDialog
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        editingNote={editingNote}
                        setEditingNote={setEditingNote}
                        newNote={newNote}
                        setNewNote={setNewNote}
                        categories={categories}
                        handleAddNote={handleAddNote}
                        handleUpdateNote={handleUpdateNote}
                        handleCategoryChange={handleCategoryChange}
                        isCreatingNewCategory={isCreatingNewCategory}
                        setIsCreatingNewCategory={setIsCreatingNewCategory}
                        newCategoryName={newCategoryName}
                        setNewCategoryName={setNewCategoryName}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        setCategories={setCategories}
                    />
                </div>
            </div>

            <CategoryManagementDialog
                isCategoryDialogOpen={isCategoryDialogOpen}
                setIsCategoryDialogOpen={setIsCategoryDialogOpen}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                categories={categories}
                notes={notes}
                handleAddCategory={handleAddCategory}
                handleEditCategory={handleEditCategory}
                handleDeleteCategory={handleDeleteCategory}
                setEditingCategory={setEditingCategory}
                setIsEditCategoryDialogOpen={setIsEditCategoryDialogOpen}
            />

            {notes.length === 0 ? (
                <EmptyState
                    setIsDialogOpen={setIsDialogOpen}
                    setIsCategoryDialogOpen={setIsCategoryDialogOpen}
                />
            ) : (
                <NotesList
                    notes={notes}
                    categories={categories}
                    collapsedCategories={collapsedCategories}
                    toggleCategory={toggleCategory}
                    handleEditNote={handleEditNote}
                    handleConvertToTask={handleConvertToTask}
                    handleDeleteNote={handleDeleteNote}
                    formatDate={formatDate}
                />
            )}

            {/* Floating Action Button for Quick Category Creation */}
            <div className='fixed bottom-6 right-6 z-50'>
                <Button
                    onClick={() => setIsCategoryDialogOpen(true)}
                    className='rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700 text-white'
                    size='lg'>
                    <FolderOpen className='h-6 w-6' />
                </Button>
            </div>
        </div>
    );
}
