"use client";

import WorkHistoryItem from "./WorkHistoryItem";

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

export default function WorkHistoryList({
    workHistory,
    historyLoading,
    runningTimeMap,
    todayStr,
    tasks,
    totalHistoryTime,
    handleReopenTask,
    reopeningTasks,
}) {
    if (historyLoading) {
        return (
            <div className='text-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#335c67] mx-auto'></div>
                <p className='mt-2 text-gray-600'>
                    Loading work history...
                </p>
            </div>
        );
    }

    if (workHistory.length === 0 && Object.keys(runningTimeMap).length === 0) {
        return (
            <div className='text-center py-8'>
                <p className='text-gray-500'>
                    No work recorded in this period.
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='mb-2 text-lg font-semibold'>
                Total Time: {formatTime(totalHistoryTime)}
            </div>
            <ul className='space-y-2'>
                {workHistory.map((w) => {
                    const extra =
                        w.date.startsWith(todayStr) && runningTimeMap[w.id]
                            ? runningTimeMap[w.id]
                            : 0;
                    return (
                        <WorkHistoryItem
                            key={w.id}
                            workItem={w}
                            extra={extra}
                            handleReopenTask={handleReopenTask}
                            reopeningTasks={reopeningTasks}
                        />
                    );
                })}
                {/* Show pseudo-entries for running timers with no workHistory yet */}
                {Object.entries(runningTimeMap)
                    .filter(([k]) => k.startsWith("new-"))
                    .map(([k, v]) => {
                        const taskId = Number(k.replace("new-", ""));
                        const task = tasks.find((t) => t.id === taskId);
                        return (
                            <WorkHistoryItem
                                key={k}
                                workItem={{
                                    id: k,
                                    task,
                                    date: typeof window === 'undefined' 
                                        ? '2024-01-01T00:00:00.000Z' 
                                        : new Date().toISOString(),
                                    totalTime: v,
                                }}
                                isRunningTimer={true}
                                handleReopenTask={handleReopenTask}
                                reopeningTasks={reopeningTasks}
                            />
                        );
                    })}
            </ul>
        </div>
    );
}
