"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

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

export default function WorkHistoryReport({
    dailyReport,
    collapsedDays,
    toggleDayCollapse,
}) {
    if (Object.keys(dailyReport).length === 0) {
        return (
            <div className='text-center py-8'>
                <p className='text-gray-500'>
                    No work history found for the selected period.
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-700'>
                Daily Work Report
            </h3>
            <div className='space-y-3'>
                {Object.entries(dailyReport)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .map(([date, dayData]) => (
                        <div
                            key={date}
                            className='border rounded-lg p-4 bg-white'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='flex items-center gap-2'>
                                        <Button
                                            size='sm'
                                            variant='ghost'
                                            onClick={() => toggleDayCollapse(date)}
                                            className='p-1 h-6 w-6'>
                                            {collapsedDays[date] ? (
                                                <ChevronRight className='h-4 w-4' />
                                            ) : (
                                                <ChevronDown className='h-4 w-4' />
                                            )}
                                        </Button>
                                        <span className='font-semibold'>
                                            {new Date(date).toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <Badge variant='secondary' className='text-sm'>
                                        {dayData.tasks.length} task
                                        {dayData.tasks.length !== 1 ? "s" : ""}
                                    </Badge>
                                </div>
                                <div className='font-mono font-semibold text-lg text-[#335c67]'>
                                    {formatTime(dayData.totalTime)}
                                </div>
                            </div>

                            {!collapsedDays[date] && (
                                <div className='mt-3 space-y-2'>
                                    {dayData.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className='flex items-center justify-between py-2 px-3 bg-gray-50 rounded'>
                                            <div className='flex-1'>
                                                <div className='font-medium'>
                                                    {task.task?.title || "Untitled Task"}
                                                </div>
                                                {task.task?.description && (
                                                    <div className='text-sm text-gray-500'>
                                                        {task.task.description}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                {task.task?.status === "completed" && (
                                                    <Badge
                                                        variant='outline'
                                                        className='text-xs py-1 px-4'>
                                                        Completed
                                                    </Badge>
                                                )}
                                                <span className='font-mono text-sm'>
                                                    {formatTime(task.totalTime)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}
