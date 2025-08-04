"use client";

import CalendarEvent from "./CalendarEvent";

export default function CalendarDay({
    date,
    events,
    isToday,
    isCurrentMonth,
    onEventClick,
}) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    if (!date) {
        return <div className='p-2 min-h-[100px] border border-gray-200'></div>;
    }

    return (
        <div
            className={`p-2 min-h-[100px] border ${
                isToday
                    ? "bg-blue-50 border-blue-200"
                    : "border-gray-200"
            } ${
                !isCurrentMonth ? "text-gray-400" : ""
            }`}>
            <div className='text-sm font-medium mb-1'>
                <div className='text-xs text-gray-500 mb-1'>
                    {dayNames[date.getDay()]}
                </div>
                {date.getDate()}
            </div>
            <div className='space-y-1'>
                {events.map((event) => (
                    <CalendarEvent
                        key={event.id}
                        event={event}
                        onClick={onEventClick}
                    />
                ))}
            </div>
        </div>
    );
} 