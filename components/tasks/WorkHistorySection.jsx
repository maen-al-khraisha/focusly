"use client";

import WorkHistoryHeader from "./WorkHistoryHeader";
import WorkHistoryList from "./WorkHistoryList";
import WorkHistoryReport from "./WorkHistoryReport";

export default function WorkHistorySection({
    historyFilter,
    setHistoryFilter,
    workHistory,
    historyLoading,
    showReport,
    setShowReport,
    collapsedDays,
    setCollapsedDays,
    totalHistoryTime,
    dailyReport,
    runningTimeMap,
    todayStr,
    tasks,
    handleReopenTask,
    reopeningTasks,
}) {
    const toggleDayCollapse = (date) => {
        setCollapsedDays((prev) => ({
            ...prev,
            [date]: !prev[date],
        }));
    };

    return (
        <div className='space-y-6'>
            <WorkHistoryHeader
                historyFilter={historyFilter}
                setHistoryFilter={setHistoryFilter}
                showReport={showReport}
                setShowReport={setShowReport}
            />
            
            {showReport ? (
                <WorkHistoryReport
                    dailyReport={dailyReport}
                    collapsedDays={collapsedDays}
                    toggleDayCollapse={toggleDayCollapse}
                />
            ) : (
                <WorkHistoryList
                    workHistory={workHistory}
                    historyLoading={historyLoading}
                    runningTimeMap={runningTimeMap}
                    todayStr={todayStr}
                    tasks={tasks}
                    totalHistoryTime={totalHistoryTime}
                    handleReopenTask={handleReopenTask}
                    reopeningTasks={reopeningTasks}
                />
            )}
        </div>
    );
}
