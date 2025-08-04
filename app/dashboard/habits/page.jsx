"use client";

import { useState, useEffect } from "react";
import {
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
} from "lucide-react";
import HabitsSkeleton from "@/components/skeletons/HabitsSkeleton";
import AddHabitDialog from "@/components/habits/AddHabitDialog";
import EditHabitDialog from "@/components/habits/EditHabitDialog";
import CategoryManagementDialog from "@/components/habits/CategoryManagementDialog";
import HabitsList from "@/components/habits/HabitsList";

export default function Habits() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isEditHabitDialogOpen, setIsEditHabitDialogOpen] = useState(false);
    const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
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

    if (loading) {
        return <HabitsSkeleton />;
    }

    return (
        <div className='p-6 space-y-8'>
            <div className='flex items-center justify-end'>
                <div className='flex items-center gap-3'>
                    <CategoryManagementDialog
                        isCategoryDialogOpen={isCategoryDialogOpen}
                        setIsCategoryDialogOpen={setIsCategoryDialogOpen}
                        newCategory={newCategory}
                        setNewCategory={setNewCategory}
                        categories={categories}
                        habits={habits}
                        handleAddCategory={handleAddCategory}
                        handleEditCategory={handleEditCategory}
                        handleDeleteCategory={handleDeleteCategory}
                        iconMap={iconMap}
                    />
                    <AddHabitDialog
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        newHabit={newHabit}
                        setNewHabit={setNewHabit}
                        categories={categories}
                        isCreatingNewCategory={isCreatingNewCategory}
                        setIsCreatingNewCategory={setIsCreatingNewCategory}
                        newCategoryName={newCategoryName}
                        setNewCategoryName={setNewCategoryName}
                        handleCategoryChange={handleCategoryChange}
                        handleAddHabit={handleAddHabit}
                        iconMap={iconMap}
                    />
                </div>
            </div>

            <EditHabitDialog
                isDialogOpen={isEditHabitDialogOpen}
                setIsDialogOpen={setIsEditHabitDialogOpen}
                newHabit={newHabit}
                setNewHabit={setNewHabit}
                categories={categories}
                handleUpdateHabit={handleUpdateHabit}
                iconMap={iconMap}
            />

            <HabitsList
                groupedHabits={groupedHabits}
                categories={categories}
                collapsedCategories={collapsedCategories}
                collapsedDays={collapsedDays}
                toggleCategory={toggleCategory}
                toggleDays={toggleDays}
                toggleHabit={toggleHabit}
                handleEditHabit={handleEditHabit}
                handleDeleteHabit={handleDeleteHabit}
                getProgress={getProgress}
                getProgressColor={getProgressColor}
                iconMap={iconMap}
            />
        </div>
    );
}
