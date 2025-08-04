"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";

export default function HabitItem({
    habit,
    collapsedDays,
    toggleDays,
    toggleHabit,
    handleEditHabit,
    handleDeleteHabit,
    getProgress,
    getProgressColor,
    iconMap,
}) {
    const HabitIcon = iconMap[habit.icon] || iconMap.Target;

    return (
        <Card className='hover:shadow-md transition-shadow'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                            <HabitIcon className='h-4 w-4 text-blue-600' />
                        </div>
                        <div>
                            <CardTitle className='text-lg'>
                                {habit.name}
                            </CardTitle>
                            <CardDescription className='flex items-center space-x-2'>
                                <span>
                                    This Week ({habit.period})
                                </span>
                                <Badge variant='default' className='text-xs'>
                                    {getProgress(habit)}% Complete
                                </Badge>
                            </CardDescription>
                        </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEditHabit(habit)}
                            className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteHabit(habit.id)}
                            className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                        <TrendingUp className='h-4 w-4 text-gray-400' />
                        <div className='w-20 bg-gray-200 rounded-full h-2'>
                            <div
                                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                                    getProgress(habit)
                                )}`}
                                style={{
                                    width: `${getProgress(habit)}%`,
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
                                Progress: {getProgress(habit)}% (
                                {habit.days.filter((day) => day.completed).length}/
                                {habit.period} days)
                            </span>
                        </div>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => toggleDays(habit.id)}
                            className='text-blue-600 hover:text-blue-700'>
                            {collapsedDays[habit.id] ? (
                                <>
                                    <ChevronRight className='h-4 w-4 mr-1' />
                                    Show Days
                                </>
                            ) : (
                                <>
                                    <ChevronDown className='h-4 w-4 mr-1' />
                                    Hide Days
                                </>
                            )}
                        </Button>
                    </div>

                    {!collapsedDays[habit.id] && (
                        <div className='border-t pt-4'>
                            <div className='text-sm font-medium text-gray-600 mb-3'>
                                Daily Progress ({habit.period} days)
                            </div>
                            <div className='grid grid-cols-10 gap-1 max-h-60 overflow-y-auto'>
                                {Array.from(
                                    { length: parseInt(habit.period) },
                                    (_, i) => i + 1
                                ).map((day) => (
                                    <div key={day} className='text-center'>
                                        <div className='text-xs font-medium text-gray-600 mb-1'>
                                            {day}
                                        </div>
                                        <div className='flex justify-center'>
                                            <Checkbox
                                                checked={
                                                    habit.days.find(
                                                        (d) => d.day === day
                                                    )?.completed || false
                                                }
                                                onCheckedChange={() =>
                                                    toggleHabit(habit.id, day)
                                                }
                                                className='w-4 h-4'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 