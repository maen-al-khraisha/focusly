"use client";

import AddTaskDialog from "./AddTaskDialog";
import TaskItem from "./TaskItem";

export default function ActiveTasksSection({
    tasks,
    loading,
    error,
    activeTasks,
    newTask,
    setNewTask,
    adding,
    isAddDialogOpen,
    setIsAddDialogOpen,
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
    handleAddTask,
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
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold'>Active Tasks</h2>
                <AddTaskDialog
                    newTask={newTask}
                    setNewTask={setNewTask}
                    adding={adding}
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    handleAddTask={handleAddTask}
                />
            </div>
            {loading ? (
                <div className='text-center py-8'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#335c67] mx-auto'></div>
                    <p className='mt-2 text-gray-600'>Loading tasks...</p>
                </div>
            ) : error ? (
                <div className='text-red-600'>{error}</div>
            ) : activeTasks.length === 0 ? (
                <div className='text-center py-8 text-gray-500'>
                    <p className='text-lg mb-2'>No active tasks yet.</p>
                    <p>
                        Click the &quot;Add Task&quot; button to create
                        your first task!
                    </p>
                </div>
            ) : (
                <ul className='space-y-4'>
                    {activeTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            task={task}
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
                    ))}
                </ul>
            )}
        </div>
    );
}
