"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import HabitItem from "./HabitItem";

export default function HabitsList({
    groupedHabits,
    categories,
    collapsedCategories,
    collapsedDays,
    toggleCategory,
    toggleDays,
    toggleHabit,
    handleEditHabit,
    handleDeleteHabit,
    getProgress,
    getProgressColor,
    iconMap,
}) {
    return (
        <div className='space-y-6'>
            {/* Show categories with habits */}
            {Object.entries(groupedHabits).map(([category, categoryHabits]) => {
                const categoryData = categories.find(
                    (cat) => cat.name === category
                );
                const CategoryIcon = categoryData
                    ? iconMap[categoryData.icon]
                    : iconMap.FolderOpen;
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
                                <Badge variant='secondary' className='ml-2'>
                                    {categoryHabits.length} habit
                                    {categoryHabits.length !== 1 ? "s" : ""}
                                </Badge>
                            </button>
                        </div>

                        {!collapsedCategories[category] && (
                            <div className='space-y-4'>
                                {categoryHabits.map((habit) => (
                                    <HabitItem
                                        key={habit.id}
                                        habit={habit}
                                        collapsedDays={collapsedDays}
                                        toggleDays={toggleDays}
                                        toggleHabit={toggleHabit}
                                        handleEditHabit={handleEditHabit}
                                        handleDeleteHabit={handleDeleteHabit}
                                        getProgress={getProgress}
                                        getProgressColor={getProgressColor}
                                        iconMap={iconMap}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Show empty categories */}
            {categories
                .filter((category) => !groupedHabits[category.name])
                .map((category) => {
                    const CategoryIcon =
                        iconMap[category.icon] || iconMap.FolderOpen;
                    return (
                        <div key={category.name} className='space-y-4'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2 text-lg font-semibold text-gray-500'>
                                    <CategoryIcon className='h-5 w-5 text-gray-400' />
                                    {category.name}
                                    <Badge variant='secondary' className='ml-2'>
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
    );
}
