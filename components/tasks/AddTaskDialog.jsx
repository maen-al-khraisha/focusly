"use client";

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
import { Plus } from "lucide-react";

export default function AddTaskDialog({
    newTask,
    setNewTask,
    adding,
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleAddTask,
}) {
    return (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <form onSubmit={handleAddTask} className='space-y-4'>
                    <div className='space-y-2'>
                        <label htmlFor='title' className='text-sm font-medium'>
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
                        <label htmlFor='description' className='text-sm font-medium'>
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
                            onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={!newTask.title.trim() || adding}
                            className='bg-[#335c67] text-[#fff3b0] hover:bg-[#284952]'>
                            {adding ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#fff3b0] mr-2'></div>
                                    Adding...
                                </>
                            ) : (
                                'Add Task'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
