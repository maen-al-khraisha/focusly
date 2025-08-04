"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";

export default function AddEventDialog({
    isDialogOpen,
    setIsDialogOpen,
    newEvent,
    setNewEvent,
    onCreateEvent,
}) {
    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className='h-4 w-4 mr-2' />
                    Add Event
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <div>
                        <label className='text-sm font-medium'>
                            Event Name
                        </label>
                        <Input
                            value={newEvent.name}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    name: e.target.value,
                                })
                            }
                            placeholder='Enter event name'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium'>
                            Description
                        </label>
                        <Textarea
                            value={newEvent.description}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    description: e.target.value,
                                })
                            }
                            placeholder='Enter event description'
                        />
                    </div>
                    <div>
                        <label className='text-sm font-medium'>
                            Link
                        </label>
                        <Input
                            value={newEvent.link}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    link: e.target.value,
                                })
                            }
                            placeholder='Enter event link (optional)'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='text-sm font-medium'>
                                Date
                            </label>
                            <Input
                                type='date'
                                value={newEvent.date}
                                onChange={(e) =>
                                    setNewEvent({
                                        ...newEvent,
                                        date: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className='text-sm font-medium'>
                                Time
                            </label>
                            <Input
                                type='time'
                                value={newEvent.time}
                                onChange={(e) =>
                                    setNewEvent({
                                        ...newEvent,
                                        time: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button
                            variant='outline'
                            onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={onCreateEvent}>
                            <Save className='h-4 w-4 mr-2' />
                            Add Event
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
