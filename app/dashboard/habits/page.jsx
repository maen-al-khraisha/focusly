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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    TrendingUp,
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
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
    Edit,
} from "lucide-react";

export default function Habits() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isEditHabitDialogOpen, setIsEditHabitDialogOpen] = useState(false);
    const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] =
        useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newHabit, setNewHabit] = useState({
        name: "",
        period: "40",
        category: "",
        icon: "Target",
    });
    const [newCategory, setNewCategory] = useState({
        name: "",
        icon: "FolderOpen",
    });
    const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [collapsedDays, setCollapsedDays] = useState({});
    const [categories, setCategories] = useState([]);
    const [habits, setHabits] = useState([]);
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [loading, setLoading] = useState(true);

    const iconMap = {
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
        FolderOpen,
        Target,
        TrendingUp,
        Plus,
        Trash2,
        ChevronDown,
        ChevronRight,
        Settings,
        Edit,
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [categoriesResponse, habitsResponse] = await Promise.all([
                fetch("/api/habit-categories"),
                fetch("/api/habits"),
            ]);

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);
            }

            if (habitsResponse.ok) {
                const habitsData = await habitsResponse.json();
                setHabits(habitsData);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHabit = async () => {
        if (newHabit.name.trim()) {
            try {
                const categoryId =
                    newHabit.category && newHabit.category !== "none"
                        ? categories.find(
                              (cat) => cat.name === newHabit.category
                          )?.id
                        : null;

                const response = await fetch("/api/habits", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newHabit.name,
                        period: newHabit.period,
                        icon: newHabit.icon,
                        categoryId: categoryId,
                    }),
                });

                if (response.ok) {
                    const createdHabit = await response.json();
                    setHabits([createdHabit, ...habits]);
                    setNewHabit({
                        name: "",
                        period: "40",
                        category: "",
                        icon: "Target",
                    });
                    setIsDialogOpen(false);
                }
            } catch (error) {
                console.error("Error creating habit:", error);
            }
        }
    };

    const handleAddCategory = async () => {
        if (newCategory.name.trim()) {
            try {
                const response = await fetch("/api/habit-categories", {
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

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setIsEditCategoryDialogOpen(true);
    };

    const handleUpdateCategory = async () => {
        if (editingCategory?.name?.trim()) {
            try {
                const response = await fetch(
                    `/api/habit-categories/${editingCategory.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: editingCategory.name,
                            icon: editingCategory.icon,
                        }),
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
            const response = await fetch(
                `/api/habit-categories/${categoryId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setCategories(
                    categories.filter((cat) => cat.id !== categoryId)
                );
                // Update habits to remove category reference
                setHabits(
                    habits.map((habit) =>
                        habit.categoryId === categoryId
                            ? { ...habit, categoryId: null, category: null }
                            : habit
                    )
                );
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleEditHabit = (habit) => {
        setEditingHabit(habit);
        setNewHabit({
            name: habit.name,
            period: habit.period,
            category: habit.category?.name || "",
            icon: habit.icon || "Target",
        });
        setIsEditHabitDialogOpen(true);
    };

    const handleUpdateHabit = async () => {
        if (newHabit.name.trim() && editingHabit) {
            try {
                const categoryId =
                    newHabit.category && newHabit.category !== "none"
                        ? categories.find(
                              (cat) => cat.name === newHabit.category
                          )?.id
                        : null;

                const response = await fetch(`/api/habits/${editingHabit.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newHabit.name,
                        period: newHabit.period,
                        icon: newHabit.icon,
                        categoryId: categoryId,
                    }),
                });

                if (response.ok) {
                    const updatedHabit = await response.json();
                    setHabits(
                        habits.map((habit) =>
                            habit.id === editingHabit.id ? updatedHabit : habit
                        )
                    );
                    setNewHabit({
                        name: "",
                        period: "40",
                        category: "",
                        icon: "Target",
                    });
                    setEditingHabit(null);
                    setIsEditHabitDialogOpen(false);
                }
            } catch (error) {
                console.error("Error updating habit:", error);
            }
        }
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            const response = await fetch(`/api/habits/${habitId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setHabits(habits.filter((habit) => habit.id !== habitId));
            }
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    };

    const toggleHabit = async (habitId, day) => {
        try {
            const habit = habits.find((h) => h.id === habitId);
            const existingDay = habit.days.find((d) => d.day === day);
            const newCompleted = !(existingDay?.completed || false);

            const response = await fetch(`/api/habits/${habitId}/days`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    day: day,
                    completed: newCompleted,
                }),
            });

            if (response.ok) {
                const updatedDay = await response.json();
                setHabits(
                    habits.map((habit) =>
                        habit.id === habitId
                            ? {
                                  ...habit,
                                  days: habit.days
                                      .map((d) =>
                                          d.day === day ? updatedDay : d
                                      )
                                      .concat(
                                          habit.days.find((d) => d.day === day)
                                              ? []
                                              : [updatedDay]
                                      ),
                              }
                            : habit
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling habit day:", error);
        }
    };

    const toggleCategory = (category) => {
        setCollapsedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const toggleDays = (habitId) => {
        setCollapsedDays((prev) => ({
            ...prev,
            [habitId]: !prev[habitId],
        }));
    };

    const handleCategoryChange = (value) => {
        if (value === "__new__") {
            setIsCreatingNewCategory(true);
            setNewHabit({ ...newHabit, category: "" });
        } else {
            setIsCreatingNewCategory(false);
            setNewCategoryName("");
            setNewHabit({
                ...newHabit,
                category: value === "none" ? "" : value,
            });
        }
    };

    const getProgress = (habit) => {
        const totalDays = parseInt(habit.period);
        const completedDays = habit.days.filter((day) => day.completed).length;
        return Math.round((completedDays / totalDays) * 100);
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-yellow-500";
        if (progress >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    // Group habits by category
    const groupedHabits = habits.reduce((acc, habit) => {
        const category = habit.category?.name || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(habit);
        return acc;
    }, {});

    // Get unique category names for the select dropdown
    const categoryNames = categories.map((cat) => cat.name);

    if (loading) {
        return (
            <div className='p-6 space-y-8'>
                <div className='text-center py-12'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
                    <p className='mt-2 text-gray-600'>Loading habits...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='p-6 space-y-8'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-900'>Habits</h2>
                    <p className='text-gray-600'>
                        Track your habits and build consistency
                    </p>
                </div>
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
                                <DialogTitle>Manage Categories</DialogTitle>
                                <DialogDescription>
                                    Create, edit, and delete categories to
                                    organize your habits.
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
                                                    ([
                                                        iconName,
                                                        IconComponent,
                                                    ]) => (
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
                                                                    {
                                                                        category.name
                                                                    }
                                                                </h4>
                                                                <p className='text-sm text-gray-500'>
                                                                    {
                                                                        habits.filter(
                                                                            (
                                                                                habit
                                                                            ) =>
                                                                                habit
                                                                                    .category
                                                                                    ?.id ===
                                                                                category.id
                                                                        ).length
                                                                    }{" "}
                                                                    habits
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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className='mr-2 h-4 w-4' />
                                Add Habit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Habit</DialogTitle>
                                <DialogDescription>
                                    Create a new habit to track and build
                                    consistency over time.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='habit-name'>
                                        Habit Name
                                    </Label>
                                    <Input
                                        id='habit-name'
                                        value={newHabit.name}
                                        onChange={(e) =>
                                            setNewHabit({
                                                ...newHabit,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder='e.g., Drink 8 glasses of water'
                                    />
                                </div>
                                <div className='grid gap-2'>
                                    <Label htmlFor='habit-category'>
                                        Category (Optional)
                                    </Label>
                                    <Select
                                        value={newHabit.category}
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
                                            <SelectItem value='__new__'>
                                                + Create New Category
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {isCreatingNewCategory && (
                                        <Input
                                            placeholder='Enter new category name'
                                            value={newCategoryName}
                                            onChange={(e) =>
                                                setNewCategoryName(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    )}
                                </div>
                                <div className='grid gap-2'>
                                    <Label htmlFor='habit-period'>
                                        Tracking Period
                                    </Label>
                                    <Select
                                        value={newHabit.period}
                                        onValueChange={(value) =>
                                            setNewHabit({
                                                ...newHabit,
                                                period: value,
                                            })
                                        }>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select tracking period' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='40'>
                                                40 Days
                                            </SelectItem>
                                            <SelectItem value='100'>
                                                100 Days
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='grid gap-2'>
                                    <Label htmlFor='habit-icon'>
                                        Habit Icon
                                    </Label>
                                    <div className='grid grid-cols-8 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
                                        {Object.entries(iconMap).map(
                                            ([iconName, IconComponent]) => (
                                                <button
                                                    key={iconName}
                                                    onClick={() =>
                                                        setNewHabit({
                                                            ...newHabit,
                                                            icon: iconName,
                                                        })
                                                    }
                                                    className={`p-2 rounded-lg border-2 transition-colors ${
                                                        newHabit.icon ===
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
                            </div>
                            <DialogFooter>
                                <Button
                                    variant='outline'
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        setNewHabit({
                                            name: "",
                                            period: "40",
                                            category: "",
                                            icon: "Target",
                                        });
                                        setIsCreatingNewCategory(false);
                                        setNewCategoryName("");
                                    }}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAddHabit}
                                    disabled={
                                        !newHabit.name.trim() ||
                                        (isCreatingNewCategory &&
                                            !newCategoryName.trim())
                                    }>
                                    Add Habit
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Edit Habit Dialog */}
            <Dialog
                open={isEditHabitDialogOpen}
                onOpenChange={setIsEditHabitDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Habit</DialogTitle>
                        <DialogDescription>
                            Update your habit details and tracking period.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid gap-2'>
                            <Label htmlFor='edit-habit-name'>Habit Name</Label>
                            <Input
                                id='edit-habit-name'
                                value={newHabit.name}
                                onChange={(e) =>
                                    setNewHabit({
                                        ...newHabit,
                                        name: e.target.value,
                                    })
                                }
                                placeholder='e.g., Drink 8 glasses of water'
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='edit-habit-category'>
                                Category (Optional)
                            </Label>
                            <Select
                                value={newHabit.category}
                                onValueChange={(value) =>
                                    setNewHabit({
                                        ...newHabit,
                                        category: value === "none" ? "" : value,
                                    })
                                }>
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
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='edit-habit-period'>
                                Tracking Period
                            </Label>
                            <Select
                                value={newHabit.period}
                                onValueChange={(value) =>
                                    setNewHabit({
                                        ...newHabit,
                                        period: value,
                                    })
                                }>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select tracking period' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='40'>40 Days</SelectItem>
                                    <SelectItem value='100'>
                                        100 Days
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='grid gap-2'>
                            <Label htmlFor='edit-habit-icon'>Habit Icon</Label>
                            <div className='grid grid-cols-8 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
                                {Object.entries(iconMap).map(
                                    ([iconName, IconComponent]) => (
                                        <button
                                            key={iconName}
                                            onClick={() =>
                                                setNewHabit({
                                                    ...newHabit,
                                                    icon: iconName,
                                                })
                                            }
                                            className={`p-2 rounded-lg border-2 transition-colors ${
                                                newHabit.icon === iconName
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
                                setIsEditHabitDialogOpen(false);
                                setEditingHabit(null);
                                setNewHabit({
                                    name: "",
                                    period: "40",
                                    category: "",
                                    icon: "Target",
                                });
                            }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateHabit}
                            disabled={!newHabit.name.trim()}>
                            Update Habit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className='space-y-6'>
                {/* Show categories with habits */}
                {Object.entries(groupedHabits).map(
                    ([category, categoryHabits]) => {
                        const categoryData = categories.find(
                            (cat) => cat.name === category
                        );
                        const CategoryIcon = categoryData
                            ? iconMap[categoryData.icon]
                            : FolderOpen;
                        return (
                            <div key={category} className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className='flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors'>
                                        {collapsedCategories[category] ? (
                                            <ChevronRight className='h-5 w-5' />
                                        ) : (
                                            <ChevronDown className='h-5 w-5' />
                                        )}
                                        <CategoryIcon className='h-5 w-5 text-blue-600' />
                                        {category}
                                        <Badge
                                            variant='secondary'
                                            className='ml-2'>
                                            {categoryHabits.length} habit
                                            {categoryHabits.length !== 1
                                                ? "s"
                                                : ""}
                                        </Badge>
                                    </button>
                                </div>

                                {!collapsedCategories[category] && (
                                    <div className='space-y-4'>
                                        {categoryHabits.map((habit) => {
                                            const HabitIcon =
                                                iconMap[habit.icon] || Target;
                                            const categoryData =
                                                categories.find(
                                                    (cat) =>
                                                        cat.name ===
                                                        habit.category?.name
                                                );
                                            const CategoryIcon = categoryData
                                                ? iconMap[categoryData.icon]
                                                : FolderOpen;
                                            return (
                                                <Card
                                                    key={habit.id}
                                                    className='hover:shadow-md transition-shadow'>
                                                    <CardHeader>
                                                        <div className='flex items-center justify-between'>
                                                            <div className='flex items-center space-x-3'>
                                                                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                                                    <HabitIcon className='h-4 w-4 text-blue-600' />
                                                                </div>
                                                                <div>
                                                                    <CardTitle className='text-lg'>
                                                                        {
                                                                            habit.name
                                                                        }
                                                                    </CardTitle>
                                                                    <CardDescription className='flex items-center space-x-2'>
                                                                        <span>
                                                                            This
                                                                            Week
                                                                            (
                                                                            {
                                                                                habit.period
                                                                            }
                                                                            )
                                                                        </span>
                                                                        <Badge
                                                                            variant={
                                                                                "default"
                                                                            }
                                                                            className='text-xs'>
                                                                            {getProgress(
                                                                                habit
                                                                            )}
                                                                            %
                                                                            Complete
                                                                        </Badge>
                                                                    </CardDescription>
                                                                </div>
                                                            </div>
                                                            <div className='flex items-center space-x-3'>
                                                                <Button
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        handleEditHabit(
                                                                            habit
                                                                        )
                                                                    }
                                                                    className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'>
                                                                    <Edit className='h-4 w-4' />
                                                                </Button>
                                                                <Button
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        handleDeleteHabit(
                                                                            habit.id
                                                                        )
                                                                    }
                                                                    className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                                                                    <Trash2 className='h-4 w-4' />
                                                                </Button>
                                                                <TrendingUp className='h-4 w-4 text-gray-400' />
                                                                <div className='w-20 bg-gray-200 rounded-full h-2'>
                                                                    <div
                                                                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                                                            getProgress(
                                                                                habit
                                                                            )
                                                                        )}`}
                                                                        style={{
                                                                            width: `${getProgress(
                                                                                habit
                                                                            )}%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className='space-y-4'>
                                                            <div className='flex items-center justify-between'>
                                                                <div className='flex items-center gap-2'>
                                                                    <span className='text-sm font-medium text-gray-600'>
                                                                        Progress:{" "}
                                                                        {getProgress(
                                                                            habit
                                                                        )}
                                                                        % (
                                                                        {
                                                                            habit.days.filter(
                                                                                (
                                                                                    day
                                                                                ) =>
                                                                                    day.completed
                                                                            )
                                                                                .length
                                                                        }
                                                                        /
                                                                        {
                                                                            habit.period
                                                                        }{" "}
                                                                        days)
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    variant='ghost'
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        toggleDays(
                                                                            habit.id
                                                                        )
                                                                    }
                                                                    className='text-blue-600 hover:text-blue-700'>
                                                                    {collapsedDays[
                                                                        habit.id
                                                                    ] ? (
                                                                        <>
                                                                            <ChevronRight className='h-4 w-4 mr-1' />
                                                                            Show
                                                                            Days
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <ChevronDown className='h-4 w-4 mr-1' />
                                                                            Hide
                                                                            Days
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>

                                                            {!collapsedDays[
                                                                habit.id
                                                            ] && (
                                                                <div className='border-t pt-4'>
                                                                    <div className='text-sm font-medium text-gray-600 mb-3'>
                                                                        Daily
                                                                        Progress
                                                                        (
                                                                        {
                                                                            habit.period
                                                                        }{" "}
                                                                        days)
                                                                    </div>
                                                                    <div className='grid grid-cols-10 gap-1 max-h-60 overflow-y-auto'>
                                                                        {Array.from(
                                                                            {
                                                                                length: parseInt(
                                                                                    habit.period
                                                                                ),
                                                                            },
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i +
                                                                                1
                                                                        ).map(
                                                                            (
                                                                                day
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        day
                                                                                    }
                                                                                    className='text-center'>
                                                                                    <div className='text-xs font-medium text-gray-600 mb-1'>
                                                                                        {
                                                                                            day
                                                                                        }
                                                                                    </div>
                                                                                    <div className='flex justify-center'>
                                                                                        <Checkbox
                                                                                            checked={
                                                                                                habit.days.find(
                                                                                                    (
                                                                                                        d
                                                                                                    ) =>
                                                                                                        d.day ===
                                                                                                        day
                                                                                                )
                                                                                                    ?.completed ||
                                                                                                false
                                                                                            }
                                                                                            onCheckedChange={() =>
                                                                                                toggleHabit(
                                                                                                    habit.id,
                                                                                                    day
                                                                                                )
                                                                                            }
                                                                                            className='w-4 h-4'
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }
                )}

                {/* Show empty categories */}
                {categories
                    .filter((category) => !groupedHabits[category.name])
                    .map((category) => {
                        const CategoryIcon =
                            iconMap[category.icon] || FolderOpen;
                        return (
                            <div key={category.name} className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2 text-lg font-semibold text-gray-500'>
                                        <CategoryIcon className='h-5 w-5 text-gray-400' />
                                        {category.name}
                                        <Badge
                                            variant='secondary'
                                            className='ml-2'>
                                            0 habits
                                        </Badge>
                                    </div>
                                </div>
                                <div className='text-center py-8 text-gray-500'>
                                    <FolderOpen className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                                    <p>No habits in this category yet</p>
                                    <p className='text-sm'>
                                        Add a habit to get started
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>

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
