"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Calendar,
    Clock,
    Link,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Save,
    X,
} from "lucide-react";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
    const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        link: "",
        time: "",
        date: "",
    });

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const response = await axios.get(
                `/api/calendar-events?year=${year}&month=${month}`
            );
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const createEvent = async () => {
        try {
            const response = await axios.post("/api/calendar-events", newEvent);
            setEvents([...events, response.data]);
            setNewEvent({
                name: "",
                description: "",
                link: "",
                time: "",
                date: "",
            });
            setIsAddEventDialogOpen(false);
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    const updateEvent = async () => {
        try {
            const response = await axios.put(
                `/api/calendar-events/${selectedEvent.id}`,
                newEvent
            );
            setEvents(
                events.map((event) =>
                    event.id === selectedEvent.id ? response.data : event
                )
            );
            setNewEvent({
                name: "",
                description: "",
                link: "",
                time: "",
                date: "",
            });
            setSelectedEvent(null);
            setIsEditEventDialogOpen(false);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const deleteEvent = async (eventId) => {
        if (confirm("Are you sure you want to delete this event?")) {
            try {
                const response = await axios.delete(
                    `/api/calendar-events/${eventId}`
                );
                if (response.status === 204) {
                    setEvents(events.filter((event) => event.id !== eventId));
                    // Close the edit dialog if it's open
                    if (isEditEventDialogOpen) {
                        setIsEditEventDialogOpen(false);
                        setSelectedEvent(null);
                        setNewEvent({
                            name: "",
                            description: "",
                            link: "",
                            time: "",
                            date: "",
                        });
                    }
                }
            } catch (error) {
                console.error("Error deleting event:", error);
                if (error.response?.status === 404) {
                    alert("Event not found. It may have already been deleted.");
                } else {
                    alert("Failed to delete event. Please try again.");
                }
            }
        }
    };

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setNewEvent({
            name: event.name,
            description: event.description || "",
            link: event.link || "",
            time: event.time || "",
            date: event.date.split("T")[0],
        });
        setIsEditEventDialogOpen(true);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getEventsForDate = (date) => {
        if (!date) return [];
        const dateString = date.toISOString().split("T")[0];
        return events.filter(
            (event) => event.date.split("T")[0] === dateString
        );
    };

    const formatTime = (time) => {
        if (!time) return "";
        return time;
    };

    const navigateMonth = (direction) => {
        setCurrentDate(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + direction,
                1
            )
        );
    };

    const isToday = (date) => {
        const today = new Date();
        return date && date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date) => {
        return date && date.getMonth() === currentDate.getMonth();
    };

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return (
        <div className='p-6'>
            <div className='flex justify-end items-center mb-6'>
                <Dialog
                    open={isAddEventDialogOpen}
                    onOpenChange={setIsAddEventDialogOpen}>
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
                                    onClick={() =>
                                        setIsAddEventDialogOpen(false)
                                    }>
                                    Cancel
                                </Button>
                                <Button onClick={createEvent}>
                                    <Save className='h-4 w-4 mr-2' />
                                    Add Event
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => navigateMonth(-1)}>
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <CardTitle className='text-xl'>
                            {monthNames[currentDate.getMonth()]}{" "}
                            {currentDate.getFullYear()}
                        </CardTitle>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => navigateMonth(1)}>
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-7 gap-1'>
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className='p-2 text-center font-medium text-gray-600'>
                                {day}
                            </div>
                        ))}
                        {getDaysInMonth(currentDate).map((date, index) => (
                            <div
                                key={index}
                                className={`p-2 min-h-[100px] border ${
                                    isToday(date)
                                        ? "bg-blue-50 border-blue-200"
                                        : "border-gray-200"
                                } ${
                                    !isCurrentMonth(date) ? "text-gray-400" : ""
                                }`}>
                                {date && (
                                    <>
                                        <div className='text-sm font-medium mb-1'>
                                            <div className='text-xs text-gray-500 mb-1'>
                                                {dayNames[date.getDay()]}
                                            </div>
                                            {date.getDate()}
                                        </div>
                                        <div className='space-y-1'>
                                            {getEventsForDate(date).map(
                                                (event) => (
                                                    <div
                                                        key={event.id}
                                                        className='text-xs p-1 bg-green-100 rounded cursor-pointer hover:bg-green-200'
                                                        onClick={() =>
                                                            handleEditEvent(
                                                                event
                                                            )
                                                        }>
                                                        <div className='font-medium truncate'>
                                                            {event.name}
                                                        </div>
                                                        {event.time && (
                                                            <div className='text-gray-600 flex items-center gap-1'>
                                                                <Clock className='h-2 w-2' />
                                                                {formatTime(
                                                                    event.time
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Event Dialog */}
            <Dialog
                open={isEditEventDialogOpen}
                onOpenChange={setIsEditEventDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
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
                            <label className='text-sm font-medium'>Link</label>
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
                        <div className='flex justify-between'>
                            <Button
                                variant='outline'
                                onClick={() => deleteEvent(selectedEvent?.id)}
                                className='text-red-600 hover:text-red-700'>
                                <Trash2 className='h-4 w-4 mr-2' />
                                Delete
                            </Button>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outline'
                                    onClick={() =>
                                        setIsEditEventDialogOpen(false)
                                    }>
                                    Cancel
                                </Button>
                                <Button onClick={updateEvent}>
                                    <Save className='h-4 w-4 mr-2' />
                                    Update Event
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
