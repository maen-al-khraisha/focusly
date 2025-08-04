"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

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

export default function TaskTimer({
    taskId,
    isRunning,
    elapsed,
    todayWork,
    stoppingTimers,
    handleStart,
    handleStop,
}) {
    return (
        <div className='flex items-center gap-2'>
            <Button
                size='sm'
                className={`${
                    isRunning
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                } text-white`}
                onClick={() =>
                    isRunning ? handleStop(taskId) : handleStart(taskId)
                }
                disabled={stoppingTimers[taskId]}>
                {isRunning ? (
                    stoppingTimers[taskId] ? (
                        <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1'></div>
                            Stopping...
                        </>
                    ) : (
                        <>
                            <Pause className='h-4 w-4 mr-1' />
                            Stop
                        </>
                    )
                ) : (
                    <>
                        <Play className='h-4 w-4 mr-1' />
                        Start
                    </>
                )}
            </Button>
            <span className='font-mono'>
                {isRunning
                    ? formatTime(elapsed[taskId] || 0)
                    : formatTime(todayWork[taskId] || 0)}
            </span>
            <span className='text-xs text-gray-500'>
                {isRunning ? "Timer running" : "Today"}
            </span>
        </div>
    );
}
