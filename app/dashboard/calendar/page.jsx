"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddEventDialog from "@/components/calendar/AddEventDialog";
import EditEventDialog from "@/components/calendar/EditEventDialog";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(() => {
        // Use a consistent date for SSR to avoid hydration mismatch
        if (typeof window === 'undefined') {
            return new Date(2024, 0, 1); // Default date for SSR
        }
        return new Date();
    });
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

    const fetchEvents = useCallback(async () => {
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
    }, [currentDate]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

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

    const navigateMonth = (direction) => {
        setCurrentDate(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + direction,
                1
            )
        );
    };

    return (
        <div className='p-6'>
            <div className='flex justify-end items-center mb-6'>
                <AddEventDialog
                    isDialogOpen={isAddEventDialogOpen}
                    setIsDialogOpen={setIsAddEventDialogOpen}
                    newEvent={newEvent}
                    setNewEvent={setNewEvent}
                    onCreateEvent={createEvent}
                />
            </div>

            <Card>
                <CardHeader>
                    <CalendarHeader
                        currentDate={currentDate}
                        onNavigateMonth={navigateMonth}
                    />
                </CardHeader>
                <CardContent>
                    <CalendarGrid
                        currentDate={currentDate}
                        events={events}
                        onEventClick={handleEditEvent}
                    />
                </CardContent>
            </Card>

            <EditEventDialog
                isDialogOpen={isEditEventDialogOpen}
                setIsDialogOpen={setIsEditEventDialogOpen}
                selectedEvent={selectedEvent}
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                onUpdateEvent={updateEvent}
                onDeleteEvent={deleteEvent}
            />
        </div>
    );
}
