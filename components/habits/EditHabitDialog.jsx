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
} from "@/components/ui/dialog";
import IconSelector from "./IconSelector";

export default function EditHabitDialog({
    isDialogOpen,
    setIsDialogOpen,
    newHabit,
    setNewHabit,
    categories,
    handleUpdateHabit,
    iconMap,
}) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                <SelectItem value='none'>No Category</SelectItem>
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
                        <Label htmlFor='edit-habit-period'>Tracking Period</Label>
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
                        <Label htmlFor='edit-habit-icon'>Habit Icon</Label>
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
    );
}
