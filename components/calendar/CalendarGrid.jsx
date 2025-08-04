"use client";

import CalendarDay from "./CalendarDay";

export default function CalendarGrid({
    currentDate,
    events,
    onEventClick,
}) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

    const isToday = (date) => {
        // Use a consistent approach to avoid hydration mismatch
        if (typeof window === 'undefined') {
            return false; // Don't highlight today during SSR
        }
        const today = new Date();
        return date && date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date) => {
        return date && date.getMonth() === currentDate.getMonth();
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className='grid grid-cols-7 gap-1'>
            {dayNames.map((day) => (
                <div
                    key={day}
                    className='p-2 text-center font-medium text-gray-600'>
                    {day}
                </div>
            ))}
            {days.map((date, index) => (
                <CalendarDay
                    key={index}
                    date={date}
                    events={getEventsForDate(date)}
                    isToday={isToday(date)}
                    isCurrentMonth={isCurrentMonth(date)}
                    onEventClick={onEventClick}
                />
            ))}
        </div>
    );
} 