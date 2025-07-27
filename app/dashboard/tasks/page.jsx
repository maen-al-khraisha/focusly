"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Play,
    Pause,
    Trash2,
    Clock,
    CheckCircle,
    Trophy,
} from "lucide-react";
import TaskCard from "@/components/TaskCard";

export default function Tasks() {
    const { state, dispatch } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [timers, setTimers] = useState({});
    const [completedTasksFilter, setCompletedTasksFilter] = useState("week"); // 'week', 'month', 'all'

    // Update timers every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTimers((prev) => {
                const updated = { ...prev };
                Object.keys(state.activeTimers).forEach((taskId) => {
                    if (state.activeTimers[taskId]) {
                        updated[taskId] = Math.floor(
                            (Date.now() - state.activeTimers[taskId]) / 1000
                        );
                    }
                });
                return updated;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state.activeTimers]);

    const handleAddTask = () => {
        if (newTask.title.trim()) {
            dispatch({
                type: "ADD_TASK",
                payload: {
                    title: newTask.title,
                    description: newTask.description,
                    memo: "",
                    totalTime: 0,
                    createdAt: new Date().toISOString(),
                },
            });
            setNewTask({ title: "", description: "" });
            setIsDialogOpen(false);
        }
    };

    const handleStartTimer = (taskId) => {
        dispatch({ type: "START_TIMER", payload: taskId });
    };

    const handleStopTimer = (taskId) => {
        dispatch({ type: "STOP_TIMER", payload: taskId });
    };

    const handleUpdateMemo = (taskId, memo) => {
        dispatch({
            type: "UPDATE_TASK",
            payload: { id: taskId, updates: { memo } },
        });
    };

    const handleDeleteTask = (taskId) => {
        dispatch({ type: "DELETE_TASK", payload: taskId });
    };

    const handleFinishTask = (taskId) => {
        dispatch({ type: "FINISH_TASK", payload: taskId });
    };

    const handleDeleteFinishedTask = (taskId) => {
        dispatch({ type: "DELETE_FINISHED_TASK", payload: taskId });
    };

    const getFilteredFinishedTasks = () => {
        const now = new Date();
        const startOfToday = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Combine finished tasks and in-progress tasks (active timers)
        const inProgressTasks = state.tasks.filter(
            (task) => state.activeTimers[task.id]
        );
        // Avoid duplicates if a task is both finished and in progress (shouldn't happen, but just in case)
        const allTasks = [
            ...state.finishedTasks,
            ...inProgressTasks.filter(
                (t) => !state.finishedTasks.some((ft) => ft.id === t.id)
            ),
        ];

        return allTasks.filter((task) => {
            // Use finishedAt for finished tasks, createdAt for in-progress
            const date = task.finishedAt
                ? new Date(task.finishedAt)
                : new Date(task.createdAt);
            switch (completedTasksFilter) {
                case "day":
                    return date >= startOfToday;
                case "week":
                    return date >= oneWeekAgo;
                case "month":
                    return date >= oneMonthAgo;
                case "all":
                default:
                    return true;
            }
        });
    };

    const filteredFinishedTasks = getFilteredFinishedTasks();

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`;
        }
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className='space-y-6 p-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-2xl font-bold text-dark_slate_gray-500'>
                        Tasks
                    </h2>
                    <p className='text-dark_slate_gray-400'>
                        Manage your tasks and track time spent on each one
                        {state.finishedTasks.length > 0 && (
                            <span className='ml-2 text-hunyadi_yellow-600 font-medium'>
                                • {state.finishedTasks.length} completed
                            </span>
                        )}
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Task</DialogTitle>
                            <DialogDescription>
                                Create a new task to track your productivity and
                                time.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <div className='grid gap-2'>
                                <Label htmlFor='title'>Task Title</Label>
                                <Input
                                    id='title'
                                    value={newTask.title}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder='Enter task title...'
                                />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor='description'>
                                    Description (Optional)
                                </Label>
                                <Textarea
                                    id='description'
                                    value={newTask.description}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder='Add task description...'
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddTask}>Add Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {state.tasks.length === 0 && state.finishedTasks.length === 0 ? (
                <Card>
                    <CardContent className='flex flex-col items-center justify-center py-12'>
                        <Clock className='h-12 w-12 text-dark_slate_gray-400 mb-4' />
                        <h3 className='text-lg font-medium text-dark_slate_gray-900 mb-2'>
                            No tasks yet
                        </h3>
                        <p className='text-dark_slate_gray-600 text-center mb-6'>
                            Create your first task to start tracking your
                            productivity and managing your time effectively.
                        </p>
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className='mr-2 h-4 w-4' />
                                    Add Your First Task
                                </Button>
                            </DialogTrigger>
                        </Dialog>
                    </CardContent>
                </Card>
            ) : (
                <div className='grid gap-4'>
                    {state.tasks.map((task) => {
                        const anyTimerActive = Object.values(
                            state.activeTimers
                        ).some(Boolean);
                        return (
                            <TaskCard
                                key={task.id}
                                task={task}
                                isTimerActive={!!state.activeTimers[task.id]}
                                currentTime={timers[task.id] || 0}
                                onStart={handleStartTimer}
                                onStop={handleStopTimer}
                                onFinish={handleFinishTask}
                                onDelete={handleDeleteTask}
                                formatTime={formatTime}
                                onUpdateTask={(id, updates) =>
                                    dispatch({
                                        type: "UPDATE_TASK",
                                        payload: { id, updates },
                                    })
                                }
                                disableStart={
                                    anyTimerActive &&
                                    !state.activeTimers[task.id]
                                }
                            />
                        );
                    })}
                </div>
            )}

            {/* Finished Tasks Section */}
            {state.finishedTasks.length > 0 && (
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <Trophy className='h-5 w-5 text-hunyadi_yellow-600' />
                            <h3 className='text-lg font-semibold text-dark_slate_gray-900'>
                                Completed Tasks
                            </h3>
                            <span className='text-sm text-dark_slate_gray-500'>
                                ({filteredFinishedTasks.length} of{" "}
                                {state.finishedTasks.length})
                            </span>
                        </div>
                        <div className='flex space-x-2'>
                            <Button
                                variant={
                                    completedTasksFilter === "day"
                                        ? "default"
                                        : "outline"
                                }
                                size='sm'
                                onClick={() => setCompletedTasksFilter("day")}>
                                Today
                            </Button>
                            <Button
                                variant={
                                    completedTasksFilter === "week"
                                        ? "default"
                                        : "outline"
                                }
                                size='sm'
                                onClick={() => setCompletedTasksFilter("week")}>
                                Last Week
                            </Button>
                            <Button
                                variant={
                                    completedTasksFilter === "month"
                                        ? "default"
                                        : "outline"
                                }
                                size='sm'
                                onClick={() =>
                                    setCompletedTasksFilter("month")
                                }>
                                Last Month
                            </Button>
                            <Button
                                variant={
                                    completedTasksFilter === "all"
                                        ? "default"
                                        : "outline"
                                }
                                size='sm'
                                onClick={() => setCompletedTasksFilter("all")}>
                                All Tasks
                            </Button>
                        </div>
                    </div>

                    {filteredFinishedTasks.length === 0 ? (
                        <Card className='border-dashed border-2 border-dark_slate_gray-300'>
                            <CardContent className='flex flex-col items-center justify-center py-8'>
                                <Trophy className='h-8 w-8 text-dark_slate_gray-400 mb-4' />
                                <h3 className='text-lg font-medium text-dark_slate_gray-900 mb-2'>
                                    No completed tasks in this period
                                </h3>
                                <p className='text-dark_slate_gray-600 text-center text-sm'>
                                    {completedTasksFilter === "week" &&
                                        "No tasks completed in the last week."}
                                    {completedTasksFilter === "month" &&
                                        "No tasks completed in the last month."}
                                    {completedTasksFilter === "all" &&
                                        "No tasks have been completed yet."}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className='grid gap-4'>
                            {filteredFinishedTasks.map((task) => (
                                <Card
                                    key={task.id}
                                    className='bg-hunyadi_yellow-100 border-hunyadi_yellow-300'>
                                    <CardHeader>
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1'>
                                                <div className='flex items-center space-x-2'>
                                                    <CheckCircle className='h-5 w-5 text-hunyadi_yellow-600' />
                                                    <CardTitle className='text-lg text-hunyadi_yellow-800'>
                                                        {task.title}
                                                    </CardTitle>
                                                </div>
                                                {task.description && (
                                                    <CardDescription className='mt-1 text-hunyadi_yellow-700'>
                                                        {task.description}
                                                    </CardDescription>
                                                )}
                                                <div className='mt-2 text-sm text-hunyadi_yellow-600'>
                                                    Completed on{" "}
                                                    {new Date(
                                                        task.finishedAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    handleDeleteFinishedTask(
                                                        task.id
                                                    )
                                                }
                                                className='text-auburn-600 hover:text-auburn-700 hover:bg-auburn-100'>
                                                <Trash2 className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className='space-y-4'>
                                        {/* Total Time Display */}
                                        <div className='flex items-center justify-between p-3 bg-vanilla-900 rounded-lg border border-vanilla-400'>
                                            <div className='flex items-center space-x-2'>
                                                <Clock className='h-4 w-4 text-dark_slate_gray-300' />
                                                <span className='text-sm font-medium text-dark_slate_gray-400'>
                                                    Total Time:
                                                </span>
                                            </div>
                                            <div className='text-lg font-mono font-bold text-hunyadi_yellow-700'>
                                                {formatTime(
                                                    task.totalTime || 0
                                                )}
                                            </div>
                                        </div>

                                        {/* Task Notes */}
                                        {task.memo && (
                                            <div className='space-y-2'>
                                                <Label className='text-hunyadi_yellow-800'>
                                                    Task Notes
                                                </Label>
                                                <div className='p-3 bg-vanilla-900 rounded-lg border border-vanilla-400 text-sm text-dark_slate_gray-400 whitespace-pre-wrap'>
                                                    {task.memo}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
