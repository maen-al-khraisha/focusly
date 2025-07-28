"use client";

import { useState } from "react";
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
import { Target, TrendingUp, Plus, Trash2 } from "lucide-react";

export default function Habits() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newHabit, setNewHabit] = useState({ name: "", period: "daily" });

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const handleAddHabit = () => {
        if (newHabit.name.trim()) {
            // dispatch({ // This line was removed as per the edit hint
            //   type: 'ADD_HABIT',
            //   payload: {
            //     name: newHabit.name,
            //     period: newHabit.period,
            //     days: {},
            //     createdAt: new Date().toISOString(),
            //   },
            // });
            setNewHabit({ name: "", period: "daily" });
            setIsDialogOpen(false);
        }
    };

    const handleDeleteHabit = (habitId) => {
        // dispatch({ type: 'DELETE_HABIT', payload: habitId }); // This line was removed as per the edit hint
    };

    const toggleHabit = (habitId, day) => {
        // dispatch({ // This line was removed as per the edit hint
        //   type: 'TOGGLE_HABIT',
        //   payload: { habitId, day },
        // });
    };

    const getWeeklyProgress = (habit) => {
        const completedDays = daysOfWeek.filter(
            (day) => habit.days[day]
        ).length;
        return Math.round((completedDays / 7) * 100);
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-green-500";
        if (progress >= 60) return "bg-yellow-500";
        if (progress >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-900'>Habits</h2>
                    <p className='text-gray-600'>
                        Track your habits and build consistency
                    </p>
                </div>
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
                                        <SelectItem value='daily'>
                                            Daily
                                        </SelectItem>
                                        <SelectItem value='weekly'>
                                            Weekly
                                        </SelectItem>
                                        <SelectItem value='monthly'>
                                            Monthly
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddHabit}>Add Habit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className='grid gap-6'>
                <Card key={1} className='hover:shadow-md transition-shadow'>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-3'>
                                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                                    <Target className='h-4 w-4 text-blue-600' />
                                </div>
                                <div>
                                    <CardTitle className='text-lg'>
                                        Drink Water
                                    </CardTitle>
                                    <CardDescription className='flex items-center space-x-2'>
                                        <span>This Week (daily)</span>
                                        <Badge
                                            variant={"default"}
                                            className='text-xs'>
                                            70% Complete
                                        </Badge>
                                    </CardDescription>
                                </div>
                            </div>
                            <div className='flex items-center space-x-3'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => handleDeleteHabit(1)}
                                    className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                                    <Trash2 className='h-4 w-4' />
                                </Button>
                                <TrendingUp className='h-4 w-4 text-gray-400' />
                                <div className='w-20 bg-gray-200 rounded-full h-2'>
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                            70
                                        )}`}
                                        style={{ width: `70%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-7 gap-2'>
                            {daysOfWeek.map((day) => (
                                <div key={day} className='text-center'>
                                    <div className='text-xs font-medium text-gray-600 mb-2'>
                                        {day}
                                    </div>
                                    <div className='flex justify-center'>
                                        <Checkbox
                                            checked={false}
                                            onCheckedChange={() =>
                                                toggleHabit(1, day)
                                            }
                                            className='w-6 h-6'
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
