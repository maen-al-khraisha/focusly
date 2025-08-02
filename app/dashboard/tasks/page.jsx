"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getStatusColors, getStatusText } from "../../../lib/utils.js";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Play,
    Pause,
    Check,
    Trash2,
    RotateCcw,
    ChevronDown,
    ChevronRight,
    Target,
    Clock,
    Edit,
    Plus,
    FolderOpen,
    Settings,
    Heart,
    Dumbbell,
    BookOpen,
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

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
        return `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState("active");
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        icon: "Target",
        categoryId: null,
    });
    const [adding, setAdding] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Category management state
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
        useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: "",
        icon: "FolderOpen",
    });
    const [collapsedCategories, setCollapsedCategories] = useState({});

    // Icon map for category selection
    const iconMap = {
        FolderOpen,
        Target,
        Clock,
        Edit,
        Plus,
        Heart,
        Dumbbell,
        BookOpen,
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
        Settings,
    };

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const [tasksRes, categoriesRes] = await Promise.all([
                axios.get("/api/tasks"),
                axios.get("/api/task-categories"),
            ]);
            setTasks(tasksRes.data);
            setCategories(categoriesRes.data);
        } catch (err) {
            setError("Failed to load tasks");
        }
        setLoading(false);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        setAdding(true);
        try {
            const response = await axios.post("/api/tasks", {
                title: newTask.title,
                description: newTask.description,
                icon: newTask.icon,
                categoryId: newTask.categoryId,
            });
            setTasks([response.data, ...tasks]);
            setNewTask({
                title: "",
                description: "",
                icon: "Target",
                categoryId: null,
            });
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error("Error adding task:", error);
        } finally {
            setAdding(false);
        }
    };

    // Category management functions
    const handleAddCategory = async () => {
        if (newCategory.name.trim()) {
            try {
                const response = await axios.post(
                    "/api/task-categories",
                    newCategory
                );
                setCategories([...categories, response.data]);
                setNewCategory({ name: "", icon: "FolderOpen" });
            } catch (error) {
                console.error("Error creating category:", error);
            }
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setIsEditCategoryDialogOpen(true);
    };

    const handleUpdateCategory = async () => {
        if (editingCategory?.name?.trim()) {
            try {
                const response = await axios.put(
                    `/api/task-categories/${editingCategory.id}`,
                    {
                        name: editingCategory.name,
                        icon: editingCategory.icon,
                    }
                );
                setCategories(
                    categories.map((cat) =>
                        cat.id === editingCategory.id ? response.data : cat
                    )
                );
                setEditingCategory(null);
                setIsEditCategoryDialogOpen(false);
            } catch (error) {
                console.error("Error updating category:", error);
            }
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`/api/task-categories/${categoryId}`);
            setCategories(categories.filter((cat) => cat.id !== categoryId));
            setTasks(
                tasks.map((task) =>
                    task.categoryId === categoryId
                        ? { ...task, categoryId: null, category: null }
                        : task
                )
            );
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

    const groupTasksByCategory = () => {
        const grouped = {};
        tasks.forEach((task) => {
            const categoryName = task.category?.name || "Uncategorized";
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName].push(task);
        });
        return grouped;
    };

    const activeTasks = tasks.filter((task) => task.status !== "completed");

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className='p-6 space-y-8'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Tasks</h1>
            </div>

            {/* Tab Navigation */}
            <div className='flex border-b border-gray-200'>
                <button
                    onClick={() => setActiveTab("active")}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "active"
                            ? "border-[#335c67] text-[#335c67]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}>
                    Active Tasks
                </button>
            </div>

            {/* Active Tasks Tab */}
            {activeTab === "active" && (
                <div className='space-y-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-xl font-semibold'>Active Tasks</h2>
                        <div className='flex items-center gap-3'>
                            <Dialog
                                open={isCategoryDialogOpen}
                                onOpenChange={setIsCategoryDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='outline'>
                                        <Settings className='mr-2 h-4 w-4' />
                                        Manage Categories
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='max-w-4xl'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Manage Categories
                                        </DialogTitle>
                                        <DialogDescription>
                                            Create, edit, and delete categories
                                            to organize your tasks.
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
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Label>Category Icon</Label>
                                                    <div className='grid grid-cols-8 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3'>
                                                        {Object.entries(
                                                            iconMap
                                                        ).map(
                                                            ([
                                                                iconName,
                                                                IconComponent,
                                                            ]) => (
                                                                <button
                                                                    key={
                                                                        iconName
                                                                    }
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
                                                                    <IconComponent className='h-4 w-4' />
                                                                </button>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleAddCategory}
                                                disabled={
                                                    !newCategory.name.trim()
                                                }
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
                                                        Create your first
                                                        category above
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className='grid gap-3'>
                                                    {categories.map(
                                                        (category) => {
                                                            const CategoryIcon =
                                                                iconMap[
                                                                    category
                                                                        .icon
                                                                ] || FolderOpen;
                                                            return (
                                                                <div
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'>
                                                                    <div className='flex items-center space-x-3'>
                                                                        <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                                            <CategoryIcon className='h-4 w-4 text-blue-600' />
                                                                        </div>
                                                                        <div>
                                                                            <h4 className='font-medium'>
                                                                                {
                                                                                    category.name
                                                                                }
                                                                            </h4>
                                                                            <p className='text-sm text-gray-500'>
                                                                                {
                                                                                    tasks.filter(
                                                                                        (
                                                                                            task
                                                                                        ) =>
                                                                                            task.categoryId ===
                                                                                            category.id
                                                                                    )
                                                                                        .length
                                                                                }{" "}
                                                                                tasks
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
                                                        }
                                                    )}
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
                            <Dialog
                                open={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        className='bg-[#335c67] text-[#fff3b0] hover:bg-[#284952] flex items-center gap-2'
                                        onClick={() =>
                                            setIsAddDialogOpen(true)
                                        }>
                                        <span className='text-xl font-bold'>
                                            +
                                        </span>
                                        Add Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Task</DialogTitle>
                                        <DialogDescription>
                                            Create a new task to track your
                                            work.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='space-y-4'>
                                        <div className='space-y-2'>
                                            <label
                                                htmlFor='title'
                                                className='text-sm font-medium'>
                                                Task Title *
                                            </label>
                                            <Input
                                                id='title'
                                                placeholder='Enter task title'
                                                value={newTask.title}
                                                onChange={(e) =>
                                                    setNewTask({
                                                        ...newTask,
                                                        title: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <label
                                                htmlFor='description'
                                                className='text-sm font-medium'>
                                                Description (optional)
                                            </label>
                                            <Textarea
                                                id='description'
                                                placeholder='Enter task description'
                                                value={newTask.description}
                                                onChange={(e) =>
                                                    setNewTask({
                                                        ...newTask,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <label
                                                htmlFor='category'
                                                className='text-sm font-medium'>
                                                Category (optional)
                                            </label>
                                            <Select
                                                value={
                                                    newTask.categoryId?.toString() ||
                                                    ""
                                                }
                                                onValueChange={(value) =>
                                                    setNewTask({
                                                        ...newTask,
                                                        categoryId: value
                                                            ? parseInt(value)
                                                            : null,
                                                    })
                                                }>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select a category' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value=''>
                                                        No Category
                                                    </SelectItem>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.id
                                                                }
                                                                value={category.id.toString()}>
                                                                <div className='flex items-center space-x-2'>
                                                                    {(() => {
                                                                        const IconComponent =
                                                                            iconMap[
                                                                                category
                                                                                    .icon
                                                                            ];
                                                                        return IconComponent ? (
                                                                            <IconComponent className='h-4 w-4' />
                                                                        ) : null;
                                                                    })()}
                                                                    <span>
                                                                        {
                                                                            category.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={() =>
                                                    setIsAddDialogOpen(false)
                                                }>
                                                Cancel
                                            </Button>
                                            <Button
                                                type='button'
                                                onClick={() => {
                                                    if (newTask.title.trim()) {
                                                        handleAddTask({
                                                            preventDefault:
                                                                () => {},
                                                        });
                                                    }
                                                }}
                                                disabled={!newTask.title.trim()}
                                                className='bg-[#335c67] text-[#fff3b0] hover:bg-[#284952]'>
                                                Add Task
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                    {loading ? (
                        <div>Loading tasks...</div>
                    ) : error ? (
                        <div className='text-red-600'>{error}</div>
                    ) : activeTasks.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>
                            <p className='text-lg mb-2'>No active tasks yet.</p>
                            <p>
                                Click the "Add Task" button to create your first
                                task!
                            </p>
                        </div>
                    ) : (
                        <div className='space-y-6'>
                            {Object.entries(groupTasksByCategory()).map(
                                ([categoryName, categoryTasks]) => (
                                    <div
                                        key={categoryName}
                                        className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <button
                                                onClick={() =>
                                                    toggleCategory(categoryName)
                                                }
                                                className='flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors'>
                                                {collapsedCategories[
                                                    categoryName
                                                ] ? (
                                                    <ChevronRight className='h-5 w-5' />
                                                ) : (
                                                    <ChevronDown className='h-5 w-5' />
                                                )}
                                                {categoryName !==
                                                    "Uncategorized" &&
                                                    categories.find(
                                                        (cat) =>
                                                            cat.name ===
                                                            categoryName
                                                    ) &&
                                                    (() => {
                                                        const CategoryIcon =
                                                            iconMap[
                                                                categories.find(
                                                                    (cat) =>
                                                                        cat.name ===
                                                                        categoryName
                                                                )?.icon
                                                            ] || FolderOpen;
                                                        return (
                                                            <CategoryIcon className='h-5 w-5 text-blue-600' />
                                                        );
                                                    })()}
                                                {categoryName}
                                                <Badge
                                                    variant='secondary'
                                                    className='ml-2'>
                                                    {categoryTasks.length} tasks
                                                </Badge>
                                            </button>
                                        </div>
                                        {!collapsedCategories[categoryName] && (
                                            <div className='space-y-4'>
                                                {categoryTasks.map((task) => (
                                                    <Card
                                                        key={task.id}
                                                        className='hover:shadow-md transition-shadow'>
                                                        <CardHeader>
                                                            <div className='flex items-center justify-between'>
                                                                <div className='flex items-center space-x-3'>
                                                                    <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                                        {(() => {
                                                                            const iconMap =
                                                                                {
                                                                                    Target,
                                                                                    Clock,
                                                                                    Edit,
                                                                                    Check,
                                                                                    Play,
                                                                                    Pause,
                                                                                    Trash2,
                                                                                    RotateCcw,
                                                                                };
                                                                            const TaskIcon =
                                                                                iconMap[
                                                                                    task
                                                                                        .icon
                                                                                ] ||
                                                                                Target;
                                                                            return (
                                                                                <TaskIcon className='h-4 w-4 text-blue-600' />
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                    <div>
                                                                        <CardTitle className='text-lg'>
                                                                            {
                                                                                task.title
                                                                            }
                                                                        </CardTitle>
                                                                        <CardDescription className='flex items-center space-x-2'>
                                                                            <span>
                                                                                Active
                                                                                Task
                                                                            </span>
                                                                            <Badge
                                                                                variant='secondary'
                                                                                className='text-xs'>
                                                                                {getStatusText(
                                                                                    task.status
                                                                                )}
                                                                            </Badge>
                                                                        </CardDescription>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        {task.description && (
                                                            <CardContent>
                                                                <div className='text-gray-600'>
                                                                    {
                                                                        task.description
                                                                    }
                                                                </div>
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}

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
                                value={editingCategory?.name || ""}
                                onChange={(e) =>
                                    setEditingCategory({
                                        ...editingCategory,
                                        name: e.target.value,
                                    })
                                }
                                placeholder='Enter category name'
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
                                                setEditingCategory({
                                                    ...editingCategory,
                                                    icon: iconName,
                                                })
                                            }
                                            className={`p-2 rounded-lg border-2 transition-colors ${
                                                editingCategory?.icon ===
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
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => {
                                setIsEditCategoryDialogOpen(false);
                                setEditingCategory(null);
                            }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateCategory}
                            disabled={!editingCategory?.name?.trim()}>
                            Update Category
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
