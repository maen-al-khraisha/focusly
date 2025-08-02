"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    BookOpen,
    Trash2,
    Edit,
    CheckSquare,
    FolderOpen,
    Target,
    Clock,
    Play,
    Pause,
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
    ChevronDown,
    ChevronRight,
    Settings,
} from "lucide-react";

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
    Plus,
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
    const [expandedCategories, setExpandedCategories] = useState(new Set());
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
                // Remove the note after successful conversion
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

    // Category management functions
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

    // Note grouping functions
    const toggleCategoryExpansion = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const toggleCategory = (categoryName) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

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

    if (loading) {
        return (
            <div className='p-6 space-y-8'>
                <div className='text-center py-12'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                    <p className='mt-2 text-gray-600'>Loading notes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6 space-y-8'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-900'>Notes</h2>
                    <p className='text-gray-600'>
                        Capture your thoughts and important information
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => setIsCategoryDialogOpen(true)}>
                        <Settings className='mr-2 h-4 w-4' />
                        Manage Categories
                    </Button>
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
                                                    setNewCategoryName(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <div className='grid gap-2'>
                                                <Label>Category Icon</Label>
                                                <div className='grid grid-cols-8 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
                                                    {Object.entries(
                                                        iconMap
                                                    ).map(
                                                        ([
                                                            iconName,
                                                            IconComponent,
                                                        ]) => (
                                                            <button
                                                                key={iconName}
                                                                onClick={() =>
                                                                    setNewCategory(
                                                                        {
                                                                            ...newCategory,
                                                                            icon: iconName,
                                                                        }
                                                                    )
                                                                }
                                                                className={`p-2 rounded-lg border-2 transition-colors ${
                                                                    newCategory.icon ===
                                                                    iconName
                                                                        ? "border-blue-500 bg-blue-50"
                                                                        : "border-gray-200 hover:border-gray-300"
                                                                }`}>
                                                                <IconComponent className='h-5 w-5' />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
                                                <Button
                                                    size='sm'
                                                    onClick={async () => {
                                                        if (
                                                            newCategoryName.trim()
                                                        ) {
                                                            const categoryData =
                                                                {
                                                                    name: newCategoryName,
                                                                    icon: newCategory.icon,
                                                                };
                                                            try {
                                                                const response =
                                                                    await fetch(
                                                                        "/api/note-categories",
                                                                        {
                                                                            method: "POST",
                                                                            headers:
                                                                                {
                                                                                    "Content-Type":
                                                                                        "application/json",
                                                                                },
                                                                            body: JSON.stringify(
                                                                                categoryData
                                                                            ),
                                                                        }
                                                                    );
                                                                if (
                                                                    response.ok
                                                                ) {
                                                                    const createdCategory =
                                                                        await response.json();
                                                                    setCategories(
                                                                        [
                                                                            ...categories,
                                                                            createdCategory,
                                                                        ]
                                                                    );
                                                                    setNewNote({
                                                                        ...newNote,
                                                                        category:
                                                                            createdCategory.name,
                                                                    });
                                                                    setIsCreatingNewCategory(
                                                                        false
                                                                    );
                                                                    setNewCategoryName(
                                                                        ""
                                                                    );
                                                                    setNewCategory(
                                                                        {
                                                                            name: "",
                                                                            icon: "FolderOpen",
                                                                        }
                                                                    );
                                                                }
                                                            } catch (error) {
                                                                console.error(
                                                                    "Error creating category:",
                                                                    error
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    disabled={
                                                        !newCategoryName.trim()
                                                    }>
                                                    Create Category
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    onClick={() => {
                                                        setIsCreatingNewCategory(
                                                            false
                                                        );
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
                                    onClick={
                                        editingNote
                                            ? handleUpdateNote
                                            : handleAddNote
                                    }
                                    disabled={
                                        !newNote.title.trim() &&
                                        !newNote.content.trim()
                                    }>
                                    {editingNote ? "Update Note" : "Add Note"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Add Category Dialog */}
            <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className='max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                        <DialogDescription>
                            Create a new category to organize your notes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='category-name'>Category Name</Label>
                            <Input
                                id='category-name'
                                placeholder='Enter category name'
                                value={newCategory.name}
                                onChange={(e) =>
                                    setNewCategory({
                                        ...newCategory,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Category Icon</Label>
                            <div className='grid grid-cols-8 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
                                {Object.entries(iconMap).map(
                                    ([iconName, IconComponent]) => (
                                        <button
                                            key={iconName}
                                            onClick={() =>
                                                setNewCategory({
                                                    ...newCategory,
                                                    icon: iconName,
                                                })
                                            }
                                            className={`p-2 rounded-lg border-2 transition-colors ${
                                                newCategory.icon === iconName
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}>
                                            <IconComponent className='h-5 w-5' />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setIsCategoryDialogOpen(false);
                                setNewCategory({
                                    name: "",
                                    icon: "FolderOpen",
                                });
                            }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCategory}
                            disabled={!newCategory.name.trim()}>
                            Add Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Category Management Dialog */}
            <Dialog
                open={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                        <DialogTitle>Manage Categories</DialogTitle>
                        <DialogDescription>
                            Create, edit, and delete categories to organize your
                            notes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-6'>
                        {/* Add New Category Section */}
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold'>
                                Add New Category
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='new-category-name'>
                                        Category Name
                                    </Label>
                                    <Input
                                        id='new-category-name'
                                        placeholder='Enter category name'
                                        value={newCategory.name}
                                        onChange={(e) =>
                                            setNewCategory({
                                                ...newCategory,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label>Category Icon</Label>
                                    <div className='grid grid-cols-8 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3'>
                                        {Object.entries(iconMap).map(
                                            ([iconName, IconComponent]) => (
                                                <button
                                                    key={iconName}
                                                    onClick={() =>
                                                        setNewCategory({
                                                            ...newCategory,
                                                            icon: iconName,
                                                        })
                                                    }
                                                    className={`p-2 rounded-lg border-2 transition-colors ${
                                                        newCategory.icon ===
                                                        iconName
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-gray-300"
                                                    }`}>
                                                    <IconComponent className='h-4 w-4' />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleAddCategory}
                                disabled={!newCategory.name.trim()}
                                className='w-full md:w-auto'>
                                <Plus className='mr-2 h-4 w-4' />
                                Add Category
                            </Button>
                        </div>

                        {/* Existing Categories Section */}
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold'>
                                Existing Categories
                            </h3>
                            {categories.length === 0 ? (
                                <div className='text-center py-8 text-gray-500'>
                                    <FolderOpen className='mx-auto h-12 w-12 text-gray-300 mb-2' />
                                    <p>No categories yet</p>
                                    <p className='text-sm'>
                                        Create your first category above
                                    </p>
                                </div>
                            ) : (
                                <div className='grid gap-3'>
                                    {categories.map((category) => {
                                        const CategoryIcon =
                                            iconMap[category.icon] ||
                                            FolderOpen;
                                        return (
                                            <div
                                                key={category.id}
                                                className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'>
                                                <div className='flex items-center space-x-3'>
                                                    <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                        <CategoryIcon className='h-4 w-4 text-blue-600' />
                                                    </div>
                                                    <div>
                                                        <h4 className='font-medium'>
                                                            {category.name}
                                                        </h4>
                                                        <p className='text-sm text-gray-500'>
                                                            {
                                                                notes.filter(
                                                                    (note) =>
                                                                        note
                                                                            .category
                                                                            ?.id ===
                                                                        category.id
                                                                ).length
                                                            }{" "}
                                                            notes
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                            handleEditCategory(
                                                                category
                                                            )
                                                        }
                                                        className='h-8 w-8 p-0'
                                                        title='Edit Category'>
                                                        <Edit className='h-4 w-4' />
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                category.id
                                                            )
                                                        }
                                                        className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                                                        title='Delete Category'>
                                                        <Trash2 className='h-4 w-4' />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setIsCategoryDialogOpen(false);
                                setNewCategory({
                                    name: "",
                                    icon: "FolderOpen",
                                });
                            }}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Category Dialog */}
            <Dialog
                open={isEditCategoryDialogOpen}
                onOpenChange={setIsEditCategoryDialogOpen}>
                <DialogContent className='max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Update the category name and icon.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='edit-category-name'>
                                Category Name
                            </Label>
                            <Input
                                id='edit-category-name'
                                placeholder='Enter category name'
                                value={newCategory.name}
                                onChange={(e) =>
                                    setNewCategory({
                                        ...newCategory,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label>Category Icon</Label>
                            <div className='grid grid-cols-8 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
                                {Object.entries(iconMap).map(
                                    ([iconName, IconComponent]) => (
                                        <button
                                            key={iconName}
                                            onClick={() =>
                                                setNewCategory({
                                                    ...newCategory,
                                                    icon: iconName,
                                                })
                                            }
                                            className={`p-2 rounded-lg border-2 transition-colors ${
                                                newCategory.icon === iconName
                                                    ? "border-blue-500 bg-blue-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}>
                                            <IconComponent className='h-5 w-5' />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setIsEditCategoryDialogOpen(false);
                                setEditingCategory(null);
                                setNewCategory({
                                    name: "",
                                    icon: "FolderOpen",
                                });
                            }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateCategory}
                            disabled={!newCategory.name.trim()}>
                            Update Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {notes.length === 0 ? (
                <div className='text-center py-12'>
                    <BookOpen className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        No notes yet
                    </h3>
                    <p className='text-gray-500 mb-6'>
                        Create your first note to get started
                    </p>
                    <div className='flex items-center justify-center gap-3'>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className='mr-2 h-4 w-4' />
                            Create Your First Note
                        </Button>
                        <Button
                            variant='outline'
                            onClick={() => setIsCategoryDialogOpen(true)}
                            className='bg-green-50 border-green-200 text-green-700 hover:bg-green-100'>
                            <FolderOpen className='mr-2 h-4 w-4' />
                            Add Category
                        </Button>
                    </div>
                </div>
            ) : (
                <div className='space-y-6'>
                    {(() => {
                        const groupedNotes = groupNotesByCategory();
                        const categoryIds = Object.keys(groupedNotes);

                        return (
                            <>
                                {categoryIds.map((categoryId) => {
                                    const group = groupedNotes[categoryId];
                                    const isExpanded =
                                        expandedCategories.has(categoryId);
                                    const CategoryIcon =
                                        iconMap[group.category.icon] ||
                                        FolderOpen;

                                    return (
                                        <div
                                            key={categoryId}
                                            className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <button
                                                    onClick={() =>
                                                        toggleCategory(
                                                            group.category.name
                                                        )
                                                    }
                                                    className='flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors'>
                                                    {collapsedCategories[
                                                        group.category.name
                                                    ] ? (
                                                        <ChevronRight className='h-5 w-5' />
                                                    ) : (
                                                        <ChevronDown className='h-5 w-5' />
                                                    )}
                                                    <CategoryIcon className='h-5 w-5 text-blue-600' />
                                                    {group.category.name}
                                                    <Badge
                                                        variant='secondary'
                                                        className='ml-2'>
                                                        {group.notes.length}{" "}
                                                        note
                                                        {group.notes.length !==
                                                        1
                                                            ? "s"
                                                            : ""}
                                                    </Badge>
                                                </button>
                                            </div>

                                            {!collapsedCategories[
                                                group.category.name
                                            ] && (
                                                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                                                    {group.notes.map((note) => (
                                                        <Card
                                                            key={note.id}
                                                            className='hover:shadow-md transition-shadow'>
                                                            <CardHeader>
                                                                <div className='flex items-start justify-between'>
                                                                    <div className='flex-1'>
                                                                        <CardTitle className='text-lg font-semibold'>
                                                                            {
                                                                                note.title
                                                                            }
                                                                        </CardTitle>
                                                                        <CardDescription className='text-sm text-gray-500'>
                                                                            <div className='flex items-center gap-2'>
                                                                                <span>
                                                                                    {formatDate(
                                                                                        note.updatedAt
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </CardDescription>
                                                                    </div>
                                                                    <div className='flex items-center gap-2 ml-4'>
                                                                        <Button
                                                                            variant='ghost'
                                                                            size='sm'
                                                                            onClick={() =>
                                                                                handleEditNote(
                                                                                    note
                                                                                )
                                                                            }
                                                                            className='h-8 w-8 p-0'
                                                                            title='Edit Note'>
                                                                            <Edit className='h-4 w-4' />
                                                                        </Button>
                                                                        <Button
                                                                            variant='ghost'
                                                                            size='sm'
                                                                            onClick={() =>
                                                                                handleConvertToTask(
                                                                                    note
                                                                                )
                                                                            }
                                                                            className='h-8 w-8 p-0 text-green-600 hover:text-green-700'
                                                                            title='Convert to Task'>
                                                                            <CheckSquare className='h-4 w-4' />
                                                                        </Button>
                                                                        <Button
                                                                            variant='ghost'
                                                                            size='sm'
                                                                            onClick={() =>
                                                                                handleDeleteNote(
                                                                                    note.id
                                                                                )
                                                                            }
                                                                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                                                                            title='Delete Note'>
                                                                            <Trash2 className='h-4 w-4' />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                <div className='text-gray-700 whitespace-pre-wrap'>
                                                                    {note
                                                                        .content
                                                                        .length >
                                                                    200
                                                                        ? `${note.content.substring(
                                                                              0,
                                                                              200
                                                                          )}...`
                                                                        : note.content}
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Show empty categories */}
                                {categories
                                    .filter(
                                        (category) => !groupedNotes[category.id]
                                    )
                                    .map((category) => {
                                        const CategoryIcon =
                                            iconMap[category.icon] ||
                                            FolderOpen;
                                        return (
                                            <div
                                                key={category.id}
                                                className='space-y-4'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-2 text-lg font-semibold text-gray-500'>
                                                        <ChevronRight className='h-5 w-5' />
                                                        <CategoryIcon className='h-5 w-5 text-gray-400' />
                                                        {category.name}
                                                        <Badge
                                                            variant='secondary'
                                                            className='ml-2'>
                                                            0 notes
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className='text-center py-8 text-gray-500'>
                                                    <FolderOpen className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                                                    <p>
                                                        No notes in this
                                                        category yet
                                                    </p>
                                                    <p className='text-sm'>
                                                        Add a note to get
                                                        started
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </>
                        );
                    })()}
                </div>
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
