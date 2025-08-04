"use client";

import {
    useState,
    useEffect,
    useCallback,
    useMemo,
    lazy,
    Suspense,
} from "react";
import { useOptimizedTimer } from "@/hooks/useOptimizedTimer";
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

// Dynamic imports for code splitting
const TasksSkeleton = lazy(() =>
    import("@/components/skeletons/TasksSkeleton")
);
const ActiveTasksSection = lazy(() =>
    import("@/components/tasks/ActiveTasksSection")
);
const WorkHistorySection = lazy(() =>
    import("@/components/tasks/WorkHistorySection")
);

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

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [adding, setAdding] = useState(false);
    const { timers, elapsed, startTimer, stopTimer } = useOptimizedTimer();
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

    // Additional loading states for API calls
    const [todayWorkLoading, setTodayWorkLoading] = useState(false);
    const [stoppingTimers, setStoppingTimers] = useState({});
    const [deletingTasks, setDeletingTasks] = useState({});
    const [editingTitles, setEditingTitles] = useState({});
    const [editingDescriptions, setEditingDescriptions] = useState({});
    const [completingTasks, setCompletingTasks] = useState({});
    const [reopeningTasks, setReopeningTasks] = useState({});

    // Memoized fetch functions
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/tasks");
            setTasks(res.data);
        } catch (err) {
            setError("Failed to load tasks");
        }
        setLoading(false);
    }, []);

    const fetchTodayWork = useCallback(async () => {
        setTodayWorkLoading(true);
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
        setTodayWorkLoading(false);
    }, []);

    const fetchWorkHistory = useCallback(async () => {
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
    }, [historyFilter]);

    useEffect(() => {
        fetchTasks();
        fetchTodayWork();
    }, [fetchTasks, fetchTodayWork]);

    useEffect(() => {
        fetchWorkHistory();
    }, [fetchWorkHistory]);

    // Memoized handlers
    const handleAddTask = useCallback(
        async (e) => {
            e.preventDefault();
            if (!newTask.title.trim()) return;
            setAdding(true);
            try {
                const res = await axios.post("/api/tasks", newTask);
                setTasks((prev) => [res.data, ...prev]);
                setNewTask({ title: "", description: "" });
                setIsAddDialogOpen(false);
            } catch (err) {
                setError("Failed to add task");
            }
            setAdding(false);
        },
        [newTask]
    );

    const handleStart = useCallback(
        (taskId) => {
            startTimer(taskId);
        },
        [startTimer]
    );

    const handleStop = useCallback(
        async (taskId) => {
            const seconds = elapsed[taskId] || 0;
            if (seconds > 0) {
                setStoppingTimers((prev) => ({ ...prev, [taskId]: true }));
                const today = new Date().toISOString().split("T")[0];
                try {
                    await axios.post("/api/daily-work", {
                        taskId,
                        date: today,
                        totalTime: seconds,
                    });
                    fetchTodayWork();
                    fetchWorkHistory();
                } catch (error) {
                    console.error("Error saving work time:", error);
                    setError("Failed to save work time");
                }
                setStoppingTimers((prev) => ({ ...prev, [taskId]: false }));
            }
            stopTimer(taskId);
        },
        [elapsed, fetchTodayWork, fetchWorkHistory, stopTimer]
    );

    const handleDeleteTask = useCallback(
        async (taskId) => {
            if (!window.confirm("Are you sure you want to delete this task?"))
                return;
            setDeletingTasks((prev) => ({ ...prev, [taskId]: true }));
            try {
                await axios.delete(`/api/tasks/${taskId}`);
                setTasks((tasks) => tasks.filter((t) => t.id !== taskId));
                fetchWorkHistory();
            } catch (err) {
                setError("Failed to delete task");
            }
            setDeletingTasks((prev) => ({ ...prev, [taskId]: false }));
        },
        [fetchWorkHistory]
    );

    const handleEditTitleClick = useCallback((task) => {
        setEditingTitleId(task.id);
        setEditTitle(task.title);
    }, []);

    const handleEditDescClick = useCallback((task) => {
        setEditingDescId(task.id);
        setEditDesc(task.description || "");
    }, []);

    const handleEditTitleSave = useCallback(
        async (taskId) => {
            setEditingTitles((prev) => ({ ...prev, [taskId]: true }));
            try {
                const res = await axios.put(`/api/tasks/${taskId}`, {
                    title: editTitle,
                    description:
                        tasks.find((t) => t.id === taskId)?.description || "",
                    status:
                        tasks.find((t) => t.id === taskId)?.status || "active",
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
            setEditingTitles((prev) => ({ ...prev, [taskId]: false }));
            setEditingTitleId(null);
        },
        [editTitle, tasks, fetchWorkHistory]
    );

    const handleEditDescSave = useCallback(
        async (taskId) => {
            setEditingDescriptions((prev) => ({ ...prev, [taskId]: true }));
            try {
                const res = await axios.put(`/api/tasks/${taskId}`, {
                    title: tasks.find((t) => t.id === taskId)?.title || "",
                    description: editDesc,
                    status:
                        tasks.find((t) => t.id === taskId)?.status || "active",
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
            setEditingDescriptions((prev) => ({ ...prev, [taskId]: false }));
            setEditingDescId(null);
        },
        [editDesc, tasks, fetchWorkHistory]
    );

    const handleEditTitleKeyDown = useCallback(
        (e, taskId) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleEditTitleSave(taskId);
            } else if (e.key === "Escape") {
                setEditingTitleId(null);
            }
        },
        [handleEditTitleSave]
    );

    const handleEditDescKeyDown = useCallback(
        (e, taskId) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleEditDescSave(taskId);
            } else if (e.key === "Escape") {
                setEditingDescId(null);
            }
        },
        [handleEditDescSave]
    );

    const handleCompleteTask = useCallback(
        async (taskId) => {
            setCompletingTasks((prev) => ({ ...prev, [taskId]: true }));
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
            setCompletingTasks((prev) => ({ ...prev, [taskId]: false }));
        },
        [fetchWorkHistory]
    );

    const handleReopenTask = useCallback(
        async (taskId) => {
            setReopeningTasks((prev) => ({ ...prev, [taskId]: true }));
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
            setReopeningTasks((prev) => ({ ...prev, [taskId]: false }));
        },
        [fetchWorkHistory]
    );

    // Memoized computed values
    const activeTasks = useMemo(
        () => tasks.filter((t) => t.status !== "completed"),
        [tasks]
    );

    const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

    const runningTimeMap = useMemo(() => {
        const map = {};
        Object.entries(timers).forEach(([taskId, start]) => {
            // Find if this task has a workHistory entry for today
            const wh = workHistory.find(
                (w) =>
                    w.taskId === Number(taskId) && w.date.startsWith(todayStr)
            );
            const elapsedSec = elapsed[taskId] || 0;
            if (wh) {
                map[wh.id] = elapsedSec;
            } else {
                // If no entry, add a pseudo-entry for today
                map[`new-${taskId}`] = elapsedSec;
            }
        });
        return map;
    }, [timers, workHistory, todayStr, elapsed]);

    const totalHistoryTime = useMemo(() => {
        return (
            workHistory.reduce((sum, w) => {
                let extra = 0;
                if (w.date.startsWith(todayStr) && runningTimeMap[w.id]) {
                    extra = runningTimeMap[w.id];
                }
                return sum + w.totalTime + extra;
            }, 0) +
            Object.entries(runningTimeMap)
                .filter(([k]) => k.startsWith("new-"))
                .reduce((sum, [k, v]) => sum + v, 0)
        );
    }, [workHistory, runningTimeMap, todayStr]);

    const dailyReport = useMemo(() => {
        const report = workHistory.reduce((acc, work) => {
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
            if (!report[todayStr]) {
                report[todayStr] = {
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
                        report[todayStr].tasks.push({
                            id: key,
                            taskId: taskId,
                            date: todayStr,
                            totalTime: time,
                            task: task,
                        });
                        report[todayStr].totalTime += time;
                    }
                }
            });
        }

        return report;
    }, [workHistory, runningTimeMap, todayStr, tasks]);

    const todayTotalTime = useMemo(
        () =>
            Object.values(todayWork).reduce((sum, time) => sum + time, 0) +
            Object.values(elapsed).reduce((sum, time) => sum + time, 0),
        [todayWork, elapsed]
    );

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
    }, [showReport, workHistory.length, dailyReport]);

    return (
        <div className=' p-6 space-y-8'>
            <div className='flex justify-end items-center mb-4'>
                <div className='text-right'>
                    <div className='text-sm text-gray-600'>
                        Today&apos;s Work
                    </div>
                    <div className='text-lg font-mono font-semibold text-[#335c67] flex items-center gap-2'>
                        {todayWorkLoading ? (
                            <>
                                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#335c67]'></div>
                                Loading...
                            </>
                        ) : (
                            formatTime(todayTotalTime)
                        )}
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
                <Suspense
                    fallback={
                        <div className='text-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#335c67] mx-auto'></div>
                            <p className='mt-2 text-gray-600'>
                                Loading tasks...
                            </p>
                        </div>
                    }>
                    <ActiveTasksSection
                        tasks={tasks}
                        loading={loading}
                        error={error}
                        activeTasks={activeTasks}
                        newTask={newTask}
                        setNewTask={setNewTask}
                        adding={adding}
                        isAddDialogOpen={isAddDialogOpen}
                        setIsAddDialogOpen={setIsAddDialogOpen}
                        timers={timers}
                        elapsed={elapsed}
                        todayWork={todayWork}
                        editingTitleId={editingTitleId}
                        setEditingTitleId={setEditingTitleId}
                        editingDescId={editingDescId}
                        setEditingDescId={setEditingDescId}
                        editTitle={editTitle}
                        setEditTitle={setEditTitle}
                        editDesc={editDesc}
                        setEditDesc={setEditDesc}
                        stoppingTimers={stoppingTimers}
                        deletingTasks={deletingTasks}
                        editingTitles={editingTitles}
                        editingDescriptions={editingDescriptions}
                        completingTasks={completingTasks}
                        handleAddTask={handleAddTask}
                        handleStart={handleStart}
                        handleStop={handleStop}
                        handleDeleteTask={handleDeleteTask}
                        handleEditTitleClick={handleEditTitleClick}
                        handleEditDescClick={handleEditDescClick}
                        handleEditTitleSave={handleEditTitleSave}
                        handleEditDescSave={handleEditDescSave}
                        handleEditTitleKeyDown={handleEditTitleKeyDown}
                        handleEditDescKeyDown={handleEditDescKeyDown}
                        handleCompleteTask={handleCompleteTask}
                    />
                </Suspense>
            )}

            {/* Work History Tab */}
            {activeTab === "history" && (
                <Suspense
                    fallback={
                        <div className='text-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#335c67] mx-auto'></div>
                            <p className='mt-2 text-gray-600'>
                                Loading work history...
                            </p>
                        </div>
                    }>
                    <WorkHistorySection
                        historyFilter={historyFilter}
                        setHistoryFilter={setHistoryFilter}
                        workHistory={workHistory}
                        historyLoading={historyLoading}
                        showReport={showReport}
                        setShowReport={setShowReport}
                        collapsedDays={collapsedDays}
                        setCollapsedDays={setCollapsedDays}
                        totalHistoryTime={totalHistoryTime}
                        dailyReport={dailyReport}
                        runningTimeMap={runningTimeMap}
                        todayStr={todayStr}
                        tasks={tasks}
                        handleReopenTask={handleReopenTask}
                        reopeningTasks={reopeningTasks}
                    />
                </Suspense>
            )}
        </div>
    );
}
