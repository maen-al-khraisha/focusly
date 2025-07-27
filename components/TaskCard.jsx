import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Play, Pause, Trash2, CheckSquare } from "lucide-react";

export default function TaskCard({
    task,
    isTimerActive,
    currentTime,
    onStart,
    onStop,
    onFinish,
    onDelete,
    onMemoChange, // not used anymore
    formatTime,
    onUpdateTask, // new prop for updating title/description
    disableStart, // new prop for disabling the start button
}) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDescription, setEditingDescription] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const titleInputRef = useRef(null);
    const descInputRef = useRef(null);
    const totalDisplayTime = task.totalTime + currentTime;

    // Focus input when editing
    const handleEditTitle = () => {
        setEditingTitle(true);
        setTimeout(() => titleInputRef.current?.focus(), 0);
    };
    const handleEditDescription = () => {
        setEditingDescription(true);
        setTimeout(() => descInputRef.current?.focus(), 0);
    };
    const saveTitle = () => {
        setEditingTitle(false);
        if (title !== task.title && onUpdateTask) {
            onUpdateTask(task.id, { title });
        }
    };
    const saveDescription = () => {
        setEditingDescription(false);
        if (description !== task.description && onUpdateTask) {
            onUpdateTask(task.id, { description });
        }
    };
    return (
        <Card className='hover:shadow-md transition-shadow p-2 flex flex-col gap-2 relative'>
            {/* Delete icon in top right */}
            <div className='flex justify-end'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onFinish(task.id)}
                    className='text-green-600 hover:text-green-700 hover:bg-green-100 p-1 mr-2'
                    aria-label='Mark as Complete'
                    title='Mark as Complete'>
                    <CheckSquare className='h-4 w-4' />
                </Button>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onDelete(task.id)}
                    className=' text-auburn-600 hover:text-auburn-300  hover:bg-green-100 p-1'
                    aria-label='Delete Task'
                    title='Delete Task'>
                    <Trash2 className='h-4 w-4' />
                </Button>
            </div>
            <div className='flex flex-col md:flex-row md:items-center md:gap-4 w-full  '>
                {/* Editable Title & Description */}
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                        {editingTitle ? (
                            <input
                                ref={titleInputRef}
                                className='text-base font-semibold border-b border-primary-200 bg-transparent focus:outline-none focus:border-primary-500 transition-colors w-full'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={saveTitle}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") saveTitle();
                                }}
                            />
                        ) : (
                            <CardTitle
                                className='text-base truncate flex-1 cursor-pointer'
                                onClick={handleEditTitle}
                                title={title}>
                                {title || (
                                    <span className='italic text-gray-400'>
                                        Untitled
                                    </span>
                                )}
                            </CardTitle>
                        )}
                    </div>
                    {editingDescription ? (
                        <input
                            ref={descInputRef}
                            className='text-xs border-b border-primary-100 bg-transparent focus:outline-none focus:border-primary-400 transition-colors w-full mt-1'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={saveDescription}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveDescription();
                            }}
                        />
                    ) : (
                        <CardDescription
                            className='text-xs truncate text-dark_slate_gray-400 cursor-pointer mt-1'
                            onClick={handleEditDescription}
                            title={description}>
                            {description || (
                                <span className='italic text-gray-300'>
                                    No description
                                </span>
                            )}
                        </CardDescription>
                    )}
                </div>
                {/* Timer & Controls */}
                <div className='flex items-center gap-3 mt-2 md:mt-0'>
                    <div className='flex items-center gap-2 bg-vanilla-800 rounded px-2 py-1'>
                        <span className='font-mono font-bold text-dark_slate_gray-500 text-base'>
                            {formatTime(totalDisplayTime)}
                        </span>
                        {isTimerActive && (
                            <span className='flex items-center text-hunyadi_yellow-600 text-xs'>
                                <span className='w-2 h-2 bg-hunyadi_yellow-500 rounded-full animate-pulse mr-1' />
                                Running
                            </span>
                        )}
                    </div>

                    {isTimerActive ? (
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => onStop(task.id)}
                            className='p-1'
                            aria-label='Stop Timer'
                            title='Stop Timer'>
                            <Pause className='h-4 w-4' />
                        </Button>
                    ) : (
                        <Button
                            size='icon'
                            onClick={() => onStart(task.id)}
                            className='p-1'
                            aria-label='Start Timer'
                            title={
                                disableStart
                                    ? "You can only run one timer at a time"
                                    : "Start Timer"
                            }
                            disabled={disableStart}>
                            <Play className='h-4 w-4' />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
