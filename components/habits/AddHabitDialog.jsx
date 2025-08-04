"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import IconSelector from "./IconSelector";

export default function AddHabitDialog({
    isDialogOpen,
    setIsDialogOpen,
    newHabit,
    setNewHabit,
    categories,
    isCreatingNewCategory,
    setIsCreatingNewCategory,
    newCategoryName,
    setNewCategoryName,
    handleCategoryChange,
    handleAddHabit,
    iconMap,
}) {
    return (
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
                        Create a new habit to track and build consistency over time.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                        <Label htmlFor='habit-name'>Habit Name</Label>
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
                                    setNewCategoryName(e.target.value)
                                }
                            />
                        )}
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='habit-period'>Tracking Period</Label>
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
                                <SelectItem value='100'>100 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid gap-2'>
                        <Label htmlFor='habit-icon'>Habit Icon</Label>
                        <IconSelector
                            iconMap={iconMap}
                            selectedIcon={newHabit.icon}
                            onIconSelect={(icon) =>
                                setNewHabit({
                                    ...newHabit,
                                    icon,
                                })
                            }
                        />
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
                            (isCreatingNewCategory && !newCategoryName.trim())
                        }>
                        Add Habit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
