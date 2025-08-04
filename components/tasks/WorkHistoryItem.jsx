"use client";

import { Button } from "@/components/ui/button";

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

export default function WorkHistoryItem({
    workItem,
    extra = 0,
    handleReopenTask,
    reopeningTasks,
    isRunningTimer = false,
}) {
    const { task, date, totalTime, id } = workItem;
    
    return (
        <li className='border rounded p-3 bg-white flex flex-col md:flex-row md:items-center md:gap-4'>
            <div className='flex-1'>
                <div className='font-semibold'>
                    {task?.title || "Untitled Task"}
                </div>
                <div className='text-xs text-gray-500'>
                    {task?.description}
                </div>
            </div>
            <div className='flex items-center gap-2 mt-2 md:mt-0'>
                {task && task.status === "completed" && !isRunningTimer && (
                    <Button
                        size='sm'
                        variant='outline'
                        className='ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                        onClick={() => handleReopenTask(task.id)}
                        disabled={reopeningTasks[task.id]}
                        title='Reopen Task'>
                        {reopeningTasks[task.id] ? (
                            <>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-1'></div>
                                Reopening...
                            </>
                        ) : (
                            'Reopen'
                        )}
                    </Button>
                )}

                <span className='text-xs text-gray-500'>
                    {new Date(date).toLocaleDateString()}
                </span>
                <span className='font-mono text-base'>
                    {formatTime(totalTime + extra)}
                </span>
            </div>
        </li>
    );
}
