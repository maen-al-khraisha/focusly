"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Check, Trash2 } from "lucide-react";

// Memoized formatTime function
const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
        return `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
};

const TaskItem = memo(function TaskItem({
    task,
    timers,
    elapsed,
    todayWork,
    editingTitleId,
    setEditingTitleId,
    editingDescId,
    setEditingDescId,
    editTitle,
    setEditTitle,
    editDesc,
    setEditDesc,
    stoppingTimers,
    deletingTasks,
    editingTitles,
    editingDescriptions,
    completingTasks,
    handleStart,
    handleStop,
    handleDeleteTask,
    handleEditTitleClick,
    handleEditDescClick,
    handleEditTitleSave,
    handleEditDescSave,
    handleEditTitleKeyDown,
    handleEditDescKeyDown,
    handleCompleteTask,
}) {
    const isRunning = timers[task.id];
    const elapsedTime = elapsed[task.id] || 0;
    const todayTime = todayWork[task.id] || 0;
    const totalTime = todayTime + elapsedTime;

    const handleStartClick = useCallback(() => {
        handleStart(task.id);
    }, [handleStart, task.id]);

    const handleStopClick = useCallback(() => {
        handleStop(task.id);
    }, [handleStop, task.id]);

    const handleDeleteClick = useCallback(() => {
        handleDeleteTask(task.id);
    }, [handleDeleteTask, task.id]);

    const handleCompleteClick = useCallback(() => {
        handleCompleteTask(task.id);
    }, [handleCompleteTask, task.id]);

    const handleTitleClick = useCallback(() => {
        handleEditTitleClick(task);
    }, [handleEditTitleClick, task]);

    const handleDescClick = useCallback(() => {
        handleEditDescClick(task);
    }, [handleEditDescClick, task]);

    const handleTitleSave = useCallback(() => {
        handleEditTitleSave(task.id);
    }, [handleEditTitleSave, task.id]);

    const handleDescSave = useCallback(() => {
        handleEditDescSave(task.id);
    }, [handleEditDescSave, task.id]);

    const handleTitleKeyDown = useCallback((e) => {
        handleEditTitleKeyDown(e, task.id);
    }, [handleEditTitleKeyDown, task.id]);

    const handleDescKeyDown = useCallback((e) => {
        handleEditDescKeyDown(e, task.id);
    }, [handleEditDescKeyDown, task.id]);

    return (
        <li className='border rounded p-4 bg-white shadow flex flex-col gap-2'>
            {editingTitleId === task.id ? (
                <div className='relative'>
                    <input
                        name='title'
                        className='border-b font-semibold text-lg w-full mb-1 pr-8'
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={handleTitleKeyDown}
                        disabled={editingTitles[task.id]}
                        autoFocus
                    />
                    {editingTitles[task.id] && (
                        <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600'></div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className='font-semibold text-lg cursor-pointer hover:underline'
                    onClick={handleTitleClick}
                    title='Click to edit'>
                    {task.title}
                </div>
            )}
            
            {editingDescId === task.id ? (
                <div className='relative'>
                    <textarea
                        name='description'
                        className='border rounded w-full text-gray-600 mb-2 pr-8'
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        onBlur={handleDescSave}
                        onKeyDown={handleDescKeyDown}
                        disabled={editingDescriptions[task.id]}
                        autoFocus
                    />
                    {editingDescriptions[task.id] && (
                        <div className='absolute right-2 top-2'>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600'></div>
                        </div>
                    )}
                </div>
            ) : (
                task.description && (
                    <div
                        className='text-gray-600 cursor-pointer hover:underline'
                        onClick={handleDescClick}
                        title='Click to edit'>
                        {task.description}
                    </div>
                )
            )}

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='text-sm text-gray-600'>
                        Today: {formatTime(totalTime)}
                    </div>
                    {isRunning && (
                        <div className='text-sm text-green-600 font-mono'>
                            Running: {formatTime(elapsedTime)}
                        </div>
                    )}
                </div>

                <div className='flex items-center gap-2'>
                    {isRunning ? (
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={handleStopClick}
                            disabled={stoppingTimers[task.id]}
                            className='text-red-600 hover:text-red-700'>
                            {stoppingTimers[task.id] ? (
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-red-600'></div>
                            ) : (
                                <Pause className='h-4 w-4' />
                            )}
                            Stop
                        </Button>
                    ) : (
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={handleStartClick}
                            className='text-green-600 hover:text-green-700'>
                            <Play className='h-4 w-4' />
                            Start
                        </Button>
                    )}

                    <Button
                        size='sm'
                        variant='outline'
                        onClick={handleCompleteClick}
                        disabled={completingTasks[task.id]}
                        className='text-blue-600 hover:text-blue-700'>
                        {completingTasks[task.id] ? (
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                        ) : (
                            <Check className='h-4 w-4' />
                        )}
                        Complete
                    </Button>

                    <Button
                        size='sm'
                        variant='outline'
                        onClick={handleDeleteClick}
                        disabled={deletingTasks[task.id]}
                        className='text-red-600 hover:text-red-700'>
                        {deletingTasks[task.id] ? (
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-red-600'></div>
                        ) : (
                            <Trash2 className='h-4 w-4' />
                        )}
                    </Button>
                </div>
            </div>
        </li>
    );
});

export default TaskItem;
