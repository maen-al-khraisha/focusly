"use client";

import { Clock } from "lucide-react";

export default function CalendarEvent({ event, onClick }) {
    const formatTime = (time) => {
        if (!time) return "";
        return time;
    };

    return (
        <div
            className='text-xs p-1 bg-green-100 rounded cursor-pointer hover:bg-green-200'
            onClick={() => onClick(event)}>
            <div className='font-medium truncate'>{event.name}</div>
            {event.time && (
                <div className='text-gray-600 flex items-center gap-1'>
                    <Clock className='h-2 w-2' />
                    {formatTime(event.time)}
                </div>
            )}
        </div>
    );
} 