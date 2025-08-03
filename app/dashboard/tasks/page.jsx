"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Pause,
    Check,
    Trash2,
    Plus,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

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

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [adding, setAdding] = useState(false);
    const [timers, setTimers] = useState({});
    const [elapsed, setElapsed] = useState({});
    const [todayWork, setTodayWork] = useState({});
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    // Work history state
    const [historyFilter, setHistoryFilter] = useState("daily"); // "daily", "weekly", "monthly"
    const [workHistory, setWorkHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [collapsedDays, setCollapsedDays] = useState({});
    const [editingTitleId, setEditingTitleId] = useState(null);
    const [editingDescId, setEditingDescId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");

    useEffect(() => {
        fetchTasks();
        fetchTodayWork();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed((prev) => {
                const updated = { ...prev };
                Object.keys(timers).forEach((taskId) => {
                    updated[taskId] = Math.floor(
                        (Date.now() - timers[taskId]) / 1000
                    );
                });
                return updated;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timers]);

    useEffect(() => {
        fetchWorkHistory();
    }, [historyFilter]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/tasks");
            setTasks(res.data);
        } catch (err) {
            setError("Failed to load tasks");
        }
        setLoading(false);
    };

    const fetchTodayWork = async () => {
        const today = new Date().toISOString().split("T")[0];
        try {
            const res = await axios.get(
                `/api/daily-work?startDate=${today}&endDate=${today}`
            );
            console.log("Today's work response:", res.data);
            const map = {};
            res.data.forEach((dw) => {
                map[dw.taskId] = dw.totalTime;
            });
            setTodayWork(map);
        } catch (error) {
            console.error("Error fetching today's work:", error);
        }
    };

    const fetchWorkHistory = async () => {
        setHistoryLoading(true);
        try {
            const today = new Date();
            let startDate, endDate;

            switch (historyFilter) {
                case "daily":
                    startDate = new Date(today);
                    endDate = new Date(today);
                    break;
                case "weekly":
                    // Get the start of the week (Sunday)
                    startDate = new Date(today);
                    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
                    startDate.setDate(today.getDate() - dayOfWeek);

                    // Get the end of the week (Saturday)
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);
                    break;
                case "monthly":
                    // Get the start of the month (1st day)
                    startDate = new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        1
                    );

                    // Get the end of the month (last day)
                    endDate = new Date(
                        today.getFullYear(),
                        today.getMonth() + 1,
                        0
                    );
                    break;
                default:
                    startDate = new Date(today);
                    endDate = new Date(today);
            }

            const startDateStr = startDate.toISOString().split("T")[0];
            const endDateStr = endDate.toISOString().split("T")[0];
            console.log(
                "Fetching work history for dates:",
                startDateStr,
                "to",
                endDateStr
            );
            const params = new URLSearchParams({
                startDate: startDateStr,
                endDate: endDateStr,
            });
            const res = await axios.get(`/api/work-history?${params}`);
            console.log("Work history response:", res.data);
            setWorkHistory(res.data);
        } catch (error) {
            console.error("Error fetching work history:", error);
            setWorkHistory([]);
        }
        setHistoryLoading(false);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        setAdding(true);
        try {
            const res = await axios.post("/api/tasks", newTask);
            setTasks([res.data, ...tasks]);
            setNewTask({ title: "", description: "" });
            setIsAddDialogOpen(false);
        } catch (err) {
            setError("Failed to add task");
        }
        setAdding(false);
    };

    const handleStart = (taskId) => {
        setTimers((prev) => ({ ...prev, [taskId]: Date.now() }));
        setElapsed((prev) => ({ ...prev, [taskId]: 0 }));
    };

    const handleStop = async (taskId) => {
        const seconds = elapsed[taskId] || 0;
        if (seconds > 0) {
            const today = new Date().toISOString().split("T")[0];
            await axios.post("/api/daily-work", {
                taskId,
                date: today,
                totalTime: seconds,
            });
            fetchTodayWork();
            fetchWorkHistory();
        }
        setTimers((prev) => {
            const updated = { ...prev };
            delete updated[taskId];
            return updated;
        });
        setElapsed((prev) => {
            const updated = { ...prev };
            updated[taskId] = 0;
            return updated;
        });
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?"))
            return;
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            setTasks((tasks) => tasks.filter((t) => t.id !== taskId));
            fetchWorkHistory();
        } catch (err) {
            setError("Failed to delete task");
        }
    };

    const handleEditTitleClick = (task) => {
        setEditingTitleId(task.id);
        setEditTitle(task.title);
    };
    const handleEditDescClick = (task) => {
        setEditingDescId(task.id);
        setEditDesc(task.description || "");
    };
    const handleEditTitleSave = async (taskId) => {
        try {
            const res = await axios.put(`/api/tasks/${taskId}`, {
                title: editTitle,
                description:
                    tasks.find((t) => t.id === taskId)?.description || "",
                status: tasks.find((t) => t.id === taskId)?.status || "active",
                icon: tasks.find((t) => t.id === taskId)?.icon || "Target",
                categoryId:
                    tasks.find((t) => t.id === taskId)?.categoryId || null,
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === taskId ? res.data : t))
            );
            fetchWorkHistory();
        } catch (err) {
            console.error("Error updating task title:", err);
            setError("Failed to update task");
        }
        setEditingTitleId(null);
    };
    const handleEditDescSave = async (taskId) => {
        try {
            const res = await axios.put(`/api/tasks/${taskId}`, {
                title: tasks.find((t) => t.id === taskId)?.title || "",
                description: editDesc,
                status: tasks.find((t) => t.id === taskId)?.status || "active",
                icon: tasks.find((t) => t.id === taskId)?.icon || "Target",
                categoryId:
                    tasks.find((t) => t.id === taskId)?.categoryId || null,
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === taskId ? res.data : t))
            );
            fetchWorkHistory();
        } catch (err) {
            console.error("Error updating task description:", err);
            setError("Failed to update task");
        }
        setEditingDescId(null);
    };
    const handleEditTitleKeyDown = (e, taskId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleEditTitleSave(taskId);
        } else if (e.key === "Escape") {
            setEditingTitleId(null);
        }
    };
    const handleEditDescKeyDown = (e, taskId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleEditDescSave(taskId);
        } else if (e.key === "Escape") {
            setEditingDescId(null);
        }
    };

    // Only show incomplete tasks in the main list
    const activeTasks = tasks.filter((t) => t.status !== "completed");
    // Add complete/reopen handlers
    const handleCompleteTask = async (taskId) => {
        try {
            const res = await axios.put(`/api/tasks/${taskId}`, {
                status: "completed",
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === taskId ? res.data : t))
            );
            fetchWorkHistory();
        } catch (err) {
            setError("Failed to complete task");
        }
    };
    const handleReopenTask = async (taskId) => {
        try {
            const res = await axios.put(`/api/tasks/${taskId}`, {
                status: "active",
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === taskId ? res.data : t))
            );
            fetchWorkHistory();
        } catch (err) {
            setError("Failed to reopen task");
        }
    };

    // Calculate total time in history, including running timers for today
    const todayStr = new Date().toISOString().split("T")[0];
    const runningTimeMap = {};
    Object.entries(timers).forEach(([taskId, start]) => {
        // Find if this task has a workHistory entry for today
        const wh = workHistory.find(
            (w) => w.taskId === Number(taskId) && w.date.startsWith(todayStr)
        );
        const elapsedSec = elapsed[taskId] || 0;
        if (wh) {
            runningTimeMap[wh.id] = elapsedSec;
        } else {
            // If no entry, add a pseudo-entry for today
            runningTimeMap[`new-${taskId}`] = elapsedSec;
        }
    });
    const totalHistoryTime =
        workHistory.reduce((sum, w) => {
            let extra = 0;
            if (w.date.startsWith(todayStr) && runningTimeMap[w.id]) {
                extra = runningTimeMap[w.id];
            }
            return sum + w.totalTime + extra;
        }, 0) +
        Object.entries(runningTimeMap)
            .filter(([k]) => k.startsWith("new-"))
            .reduce((sum, [k, v]) => sum + v, 0);

    // Group work history by day for the report
    const dailyReport = workHistory.reduce((acc, work) => {
        const date = work.date.split("T")[0];
        if (!acc[date]) {
            acc[date] = {
                date: date,
                totalTime: 0,
                tasks: [],
            };
        }
        acc[date].totalTime += work.totalTime;
        acc[date].tasks.push(work);
        return acc;
    }, {});

    // Add running timers to today's report
    if (Object.keys(runningTimeMap).length > 0) {
        if (!dailyReport[todayStr]) {
            dailyReport[todayStr] = {
                date: todayStr,
                totalTime: 0,
                tasks: [],
            };
        }
        Object.entries(runningTimeMap).forEach(([key, time]) => {
            if (key.startsWith("new-")) {
                const taskId = Number(key.replace("new-", ""));
                const task = tasks.find((t) => t.id === taskId);
                if (task) {
                    dailyReport[todayStr].tasks.push({
                        id: key,
                        taskId: taskId,
                        date: todayStr,
                        totalTime: time,
                        task: task,
                    });
                    dailyReport[todayStr].totalTime += time;
                }
            }
        });
    }

    const toggleDayCollapse = (date) => {
        setCollapsedDays((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    // When showReport changes to true, collapse all days
    useEffect(() => {
        if (showReport && workHistory.length > 0) {
            const allDates = Object.keys(dailyReport);
            const collapsedState = {};
            allDates.forEach((date) => {
                collapsedState[date] = true; // true means collapsed
            });
            setCollapsedDays(collapsedState);
        }
    }, [showReport, workHistory.length]);

    // Calculate today's total work time
    const todayTotalTime =
        Object.values(todayWork).reduce((sum, time) => sum + time, 0) +
        Object.values(elapsed).reduce((sum, time) => sum + time, 0);

    return (
        <div className=' p-6 space-y-8'>
            <div className='flex justify-end items-center mb-4'>
                <div className='text-right'>
                    <div className='text-sm text-gray-600'>Today's Work</div>
                    <div className='text-lg font-mono font-semibold text-[#335c67]'>
                        {formatTime(todayTotalTime)}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className='flex border-b border-gray-200'>
                <button
                    onClick={() => setActiveTab("active")}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "active"
                            ? "border-[#335c67] text-[#335c67]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}>
                    Active Tasks
                </button>
                <button
                    onClick={() => setActiveTab("history")}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === "history"
                            ? "border-[#335c67] text-[#335c67]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}>
                    Work History
                </button>
            </div>

            {/* Active Tasks Tab */}
            {activeTab === "active" && (
                <div className='space-y-6'>
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-xl font-semibold'>Active Tasks</h2>
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className='bg-[#335c67] text-[#fff3b0] hover:bg-[#284952] flex items-center gap-2'>
                                    <Plus className='h-4 w-4' />
                                    Add Task
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Task</DialogTitle>
                                    <DialogDescription>
                                        Create a new task to track your work.
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleAddTask}
                                    className='space-y-4'>
                                    <div className='space-y-2'>
                                        <label
                                            htmlFor='title'
                                            className='text-sm font-medium'>
                                            Task Title *
                                        </label>
                                        <Input
                                            id='title'
                                            placeholder='Enter task title'
                                            value={newTask.title}
                                            onChange={(e) =>
                                                setNewTask({
                                                    ...newTask,
                                                    title: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <label
                                            htmlFor='description'
                                            className='text-sm font-medium'>
                                            Description (optional)
                                        </label>
                                        <Textarea
                                            id='description'
                                            placeholder='Enter task description'
                                            value={newTask.description}
                                            onChange={(e) =>
                                                setNewTask({
                                                    ...newTask,
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            onClick={() =>
                                                setIsAddDialogOpen(false)
                                            }>
                                            Cancel
                                        </Button>
                                        <Button
                                            type='submit'
                                            disabled={
                                                !newTask.title.trim() || adding
                                            }
                                            className='bg-[#335c67] text-[#fff3b0] hover:bg-[#284952]'>
                                            Add Task
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {loading ? (
                        <div>Loading tasks...</div>
                    ) : error ? (
                        <div className='text-red-600'>{error}</div>
                    ) : activeTasks.length === 0 ? (
                        <div className='text-center py-8 text-gray-500'>
                            <p className='text-lg mb-2'>No active tasks yet.</p>
                            <p>
                                Click the "Add Task" button to create your first
                                task!
                            </p>
                        </div>
                    ) : (
                        <ul className='space-y-4'>
                            {activeTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className='border rounded p-4 bg-white shadow flex flex-col gap-2'>
                                    {editingTitleId === task.id ? (
                                        <input
                                            name='title'
                                            className='border-b font-semibold text-lg w-full mb-1'
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                            onBlur={() =>
                                                handleEditTitleSave(task.id)
                                            }
                                            onKeyDown={(e) =>
                                                handleEditTitleKeyDown(
                                                    e,
                                                    task.id
                                                )
                                            }
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            className='font-semibold text-lg cursor-pointer hover:underline'
                                            onClick={() =>
                                                handleEditTitleClick(task)
                                            }
                                            title='Click to edit'>
                                            {task.title}
                                        </div>
                                    )}
                                    {editingDescId === task.id ? (
                                        <textarea
                                            name='description'
                                            className='border rounded w-full text-gray-600 mb-2'
                                            value={editDesc}
                                            onChange={(e) =>
                                                setEditDesc(e.target.value)
                                            }
                                            onBlur={() =>
                                                handleEditDescSave(task.id)
                                            }
                                            onKeyDown={(e) =>
                                                handleEditDescKeyDown(
                                                    e,
                                                    task.id
                                                )
                                            }
                                            autoFocus
                                        />
                                    ) : (
                                        task.description && (
                                            <div
                                                className='text-gray-600 cursor-pointer hover:underline'
                                                onClick={() =>
                                                    handleEditDescClick(task)
                                                }
                                                title='Click to edit'>
                                                {task.description}
                                            </div>
                                        )
                                    )}
                                    <div className='flex items-center gap-4 mt-2 justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                size='sm'
                                                className={`${
                                                    timers[task.id]
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                } text-white`}
                                                onClick={() =>
                                                    timers[task.id]
                                                        ? handleStop(task.id)
                                                        : handleStart(task.id)
                                                }>
                                                {timers[task.id] ? (
                                                    <>
                                                        <Pause className='h-4 w-4 mr-1' />
                                                        Stop
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className='h-4 w-4 mr-1' />
                                                        Start
                                                    </>
                                                )}
                                            </Button>
                                            <span className='font-mono'>
                                                {timers[task.id]
                                                    ? formatTime(
                                                          elapsed[task.id] || 0
                                                      )
                                                    : formatTime(
                                                          todayWork[task.id] ||
                                                              0
                                                      )}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                                {timers[task.id]
                                                    ? "Timer running"
                                                    : "Today"}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                className='bg-green-100 text-green-700 hover:bg-green-200 border-green-200'
                                                onClick={() =>
                                                    handleCompleteTask(task.id)
                                                }
                                                title='Mark as Complete'>
                                                <Check className='h-4 w-4 mr-1' />
                                                Finish
                                            </Button>
                                            <Button
                                                size='sm'
                                                variant='outline'
                                                className='bg-red-100 text-red-700 hover:bg-red-200 border-red-200'
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                                title='Delete Task'>
                                                <Trash2 className='h-4 w-4 mr-1' />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Work History Tab */}
            {activeTab === "history" && (
                <div className='space-y-6'>
                    <div className='flex flex-col gap-4 mb-2'>
                        <h2 className='text-xl font-bold'>Work History</h2>
                        <div className='flex items-center gap-2'>
                            <Button
                                size='sm'
                                variant={
                                    historyFilter === "daily"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setHistoryFilter("daily")}
                                className={
                                    historyFilter === "daily"
                                        ? "bg-[#335c67] text-[#fff3b0]"
                                        : ""
                                }>
                                Daily
                            </Button>
                            <Button
                                size='sm'
                                variant={
                                    historyFilter === "weekly"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setHistoryFilter("weekly")}
                                className={
                                    historyFilter === "weekly"
                                        ? "bg-[#335c67] text-[#fff3b0]"
                                        : ""
                                }>
                                Weekly
                            </Button>
                            <Button
                                size='sm'
                                variant={
                                    historyFilter === "monthly"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setHistoryFilter("monthly")}
                                className={
                                    historyFilter === "monthly"
                                        ? "bg-[#335c67] text-[#fff3b0]"
                                        : ""
                                }>
                                Monthly
                            </Button>
                            <div className='ml-auto'>
                                <Button
                                    size='sm'
                                    variant='outline'
                                    onClick={() => setShowReport(!showReport)}
                                    className={`flex items-center gap-2 ${
                                        showReport ? "border-accent" : ""
                                    }`}>
                                    {showReport ? "Hide Report" : "Show Report"}
                                </Button>
                            </div>
                        </div>
                    </div>
                    {showReport ? (
                        // Show only the report when showReport is true
                        Object.keys(dailyReport).length > 0 ? (
                            <div className='space-y-4'>
                                <h3 className='text-lg font-semibold text-gray-700'>
                                    Daily Work Report
                                </h3>
                                <div className='space-y-3'>
                                    {Object.entries(dailyReport)
                                        .sort(
                                            ([a], [b]) =>
                                                new Date(b) - new Date(a)
                                        )
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
                                                                onClick={() =>
                                                                    toggleDayCollapse(
                                                                        date
                                                                    )
                                                                }
                                                                className='p-1 h-6 w-6'>
                                                                {collapsedDays[
                                                                    date
                                                                ] ? (
                                                                    <ChevronRight className='h-4 w-4' />
                                                                ) : (
                                                                    <ChevronDown className='h-4 w-4' />
                                                                )}
                                                            </Button>
                                                            <span className='font-semibold'>
                                                                {new Date(
                                                                    date
                                                                ).toLocaleDateString(
                                                                    "en-US",
                                                                    {
                                                                        weekday:
                                                                            "long",
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </span>
                                                        </div>
                                                        <Badge
                                                            variant='secondary'
                                                            className='text-sm'>
                                                            {
                                                                dayData.tasks
                                                                    .length
                                                            }{" "}
                                                            task
                                                            {dayData.tasks
                                                                .length !== 1
                                                                ? "s"
                                                                : ""}
                                                        </Badge>
                                                    </div>
                                                    <div className='font-mono font-semibold text-lg text-[#335c67]'>
                                                        {formatTime(
                                                            dayData.totalTime
                                                        )}
                                                    </div>
                                                </div>

                                                {!collapsedDays[date] && (
                                                    <div className='mt-3 space-y-2'>
                                                        {dayData.tasks.map(
                                                            (task) => (
                                                                <div
                                                                    key={
                                                                        task.id
                                                                    }
                                                                    className='flex items-center justify-between py-2 px-3 bg-gray-50 rounded'>
                                                                    <div className='flex-1'>
                                                                        <div className='font-medium'>
                                                                            {task
                                                                                .task
                                                                                ?.title ||
                                                                                "Untitled Task"}
                                                                        </div>
                                                                        {task
                                                                            .task
                                                                            ?.description && (
                                                                            <div className='text-sm text-gray-500'>
                                                                                {
                                                                                    task
                                                                                        .task
                                                                                        .description
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className='flex items-center gap-2'>
                                                                        {task
                                                                            .task
                                                                            ?.status ===
                                                                            "completed" && (
                                                                            <Badge
                                                                                variant='outline'
                                                                                className='text-xs py-1 px-4'>
                                                                                Completed
                                                                            </Badge>
                                                                        )}
                                                                        <span className='font-mono text-sm'>
                                                                            {formatTime(
                                                                                task.totalTime
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <div className='text-center py-8'>
                                <p className='text-gray-500'>
                                    No work history found for the selected
                                    period.
                                </p>
                            </div>
                        )
                    ) : (
                        // Show only the task list when showReport is false
                        <div className='space-y-4'>
                            <div className='mb-2 text-lg font-semibold'>
                                Total Time: {formatTime(totalHistoryTime)}
                            </div>
                            {historyLoading ? (
                                <div className='text-center py-8'>
                                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#335c67] mx-auto'></div>
                                    <p className='mt-2 text-gray-600'>
                                        Loading work history...
                                    </p>
                                </div>
                            ) : workHistory.length === 0 &&
                              Object.keys(runningTimeMap).length === 0 ? (
                                <div className='text-center py-8'>
                                    <p className='text-gray-500'>
                                        No work recorded in this period.
                                    </p>
                                </div>
                            ) : (
                                <ul className='space-y-2'>
                                    {workHistory.map((w) => {
                                        const extra =
                                            w.date.startsWith(todayStr) &&
                                            runningTimeMap[w.id]
                                                ? runningTimeMap[w.id]
                                                : 0;
                                        return (
                                            <li
                                                key={w.id}
                                                className='border rounded p-3 bg-white flex flex-col md:flex-row md:items-center md:gap-4'>
                                                <div className='flex-1'>
                                                    <div className='font-semibold'>
                                                        {w.task?.title ||
                                                            "Untitled Task"}
                                                    </div>
                                                    <div className='text-xs text-gray-500'>
                                                        {w.task?.description}
                                                    </div>
                                                </div>
                                                <div className='flex items-center gap-2 mt-2 md:mt-0'>
                                                    {w.task &&
                                                        w.task.status ===
                                                            "completed" && (
                                                            <Button
                                                                size='sm'
                                                                variant='outline'
                                                                className='ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                                                                onClick={() =>
                                                                    handleReopenTask(
                                                                        w.task
                                                                            .id
                                                                    )
                                                                }
                                                                title='Reopen Task'>
                                                                Reopen
                                                            </Button>
                                                        )}

                                                    <span className='text-xs text-gray-500'>
                                                        {new Date(
                                                            w.date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span className='font-mono text-base'>
                                                        {formatTime(
                                                            w.totalTime + extra
                                                        )}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                    {/* Show pseudo-entries for running timers with no workHistory yet */}
                                    {Object.entries(runningTimeMap)
                                        .filter(([k]) => k.startsWith("new-"))
                                        .map(([k, v]) => {
                                            const taskId = Number(
                                                k.replace("new-", "")
                                            );
                                            const task = tasks.find(
                                                (t) => t.id === taskId
                                            );
                                            return (
                                                <li
                                                    key={k}
                                                    className='border rounded p-3 bg-white flex flex-col md:flex-row md:items-center md:gap-4'>
                                                    <div className='flex-1'>
                                                        <div className='font-semibold'>
                                                            {task?.title ||
                                                                "Untitled Task"}
                                                        </div>
                                                        <div className='text-xs text-gray-500'>
                                                            {task?.description}
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2 mt-2 md:mt-0'>
                                                        <span className='font-mono text-base'>
                                                            {formatTime(v)}
                                                        </span>
                                                        <span className='text-xs text-gray-500'>
                                                            {new Date().toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
