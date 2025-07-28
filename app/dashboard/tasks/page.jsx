"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    // Work history state
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
    });
    const [endDate, setEndDate] = useState(() => new Date());
    const [workHistory, setWorkHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
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
    }, [startDate, endDate]);

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
            const map = {};
            res.data.forEach((dw) => {
                map[dw.taskId] = dw.totalTime;
            });
            setTodayWork(map);
        } catch {}
    };

    const fetchWorkHistory = async () => {
        setHistoryLoading(true);
        try {
            const params = new URLSearchParams({
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
            });
            const res = await axios.get(`/api/work-history?${params}`);
            setWorkHistory(res.data);
        } catch {
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
        } catch (err) {
            setError("Failed to add task");
        }
        setAdding(false);
    };

    const handleStart = async (taskId) => {
        // Update task status to in_progress when starting timer
        try {
            await axios.put(`/api/tasks/${taskId}`, {
                status: "in_progress",
            });
            setTasks((tasks) =>
                tasks.map((t) =>
                    t.id === taskId ? { ...t, status: "in_progress" } : t
                )
            );
        } catch (err) {
            setError("Failed to update task status");
        }

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
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === taskId ? res.data : t))
            );
            fetchWorkHistory();
        } catch (err) {
            setError("Failed to update task");
        }
        setEditingTitleId(null);
    };
    const handleEditDescSave = async (taskId) => {
        try {
            const res = await axios.put(`/api/tasks/${taskId}`, {
                description: editDesc,
            });
            setTasks((tasks) =>
                tasks.map((t) => (t.id === taskId ? res.data : t))
            );
            fetchWorkHistory();
        } catch (err) {
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

    // Show active tasks (not_started and in_progress)
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
                status: "not_started",
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

    return (
        <div className='max-w-2xl mx-auto p-6 space-y-8'>
            <h1 className='text-2xl font-bold mb-4'>Tasks</h1>

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
                    <form
                        onSubmit={handleAddTask}
                        className='flex flex-col gap-2 mb-6'>
                        <input
                            className='border rounded px-3 py-2'
                            placeholder='Task title'
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    title: e.target.value,
                                })
                            }
                            required
                        />
                        <textarea
                            className='border rounded px-3 py-2'
                            placeholder='Description (optional)'
                            value={newTask.description}
                            onChange={(e) =>
                                setNewTask({
                                    ...newTask,
                                    description: e.target.value,
                                })
                            }
                        />
                        <button
                            type='submit'
                            className='bg-[#335c67] text-[#fff3b0] flex items-center gap-2 px-5 py-2 rounded-lg font-semibold shadow hover:bg-[#284952] disabled:opacity-50'
                            disabled={adding}>
                            <span className='text-xl font-bold'>+</span>
                            Add Task
                        </button>
                    </form>
                    {loading ? (
                        <div>Loading tasks...</div>
                    ) : error ? (
                        <div className='text-red-600'>{error}</div>
                    ) : activeTasks.length === 0 ? (
                        <div>No tasks yet. Add your first task above!</div>
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
                                            <button
                                                className={`px-3 py-1 rounded ${
                                                    timers[task.id]
                                                        ? "bg-red-600"
                                                        : "bg-green-600"
                                                } text-white`}
                                                onClick={() =>
                                                    timers[task.id]
                                                        ? handleStop(task.id)
                                                        : handleStart(task.id)
                                                }>
                                                {timers[task.id]
                                                    ? "Stop"
                                                    : "Start"}
                                            </button>
                                            <span className='font-mono'>
                                                {timers[task.id]
                                                    ? formatTime(
                                                          elapsed[task.id] || 0
                                                      )
                                                    : formatTime(0)}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                                {timers[task.id]
                                                    ? "Timer running"
                                                    : task.status ===
                                                      "in_progress"
                                                    ? "In progress"
                                                    : "Not started"}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                className='px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200'
                                                onClick={() =>
                                                    handleCompleteTask(task.id)
                                                }
                                                title='Mark as Complete'>
                                                Finish
                                            </button>
                                            <button
                                                className='ml-auto px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200'
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                                title='Delete Task'>
                                                Delete
                                            </button>
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
                        <h2 className='text-xl font-bold flex-1'>
                            Work History
                        </h2>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm'>From:</span>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                className='border rounded px-2 py-1 text-sm'
                                dateFormat='yyyy-MM-dd'
                            />
                            <span className='text-sm'>To:</span>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                className='border rounded px-2 py-1 text-sm'
                                dateFormat='yyyy-MM-dd'
                            />
                        </div>
                    </div>
                    <div className='mb-2 text-lg font-semibold'>
                        Total Time: {formatTime(totalHistoryTime)}
                    </div>
                    {historyLoading ? (
                        <div>Loading work history...</div>
                    ) : workHistory.length === 0 &&
                      Object.keys(runningTimeMap).length === 0 ? (
                        <div>No work recorded in this period.</div>
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
                                            <span className='font-mono text-base'>
                                                {formatTime(
                                                    w.totalTime + extra
                                                )}
                                            </span>
                                            <span className='text-xs text-gray-500'>
                                                {new Date(
                                                    w.date
                                                ).toLocaleDateString()}
                                            </span>
                                            {w.task &&
                                                w.task.status ===
                                                    "completed" && (
                                                    <button
                                                        className='ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        onClick={() =>
                                                            handleReopenTask(
                                                                w.task.id
                                                            )
                                                        }
                                                        title='Reopen Task'>
                                                        Reopen
                                                    </button>
                                                )}
                                            {w.id &&
                                                w.id.startsWith("completed-") &&
                                                w.totalTime === 0 && (
                                                    <span className='text-xs text-gray-400 italic'>
                                                        No work time
                                                    </span>
                                                )}
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
    );
}
