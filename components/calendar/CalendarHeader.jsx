"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarHeader({
    currentDate,
    onNavigateMonth,
}) {
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
        <div className='flex justify-between items-center'>
            <Button
                variant='outline'
                size='sm'
                onClick={() => onNavigateMonth(-1)}>
                <ChevronLeft className='h-4 w-4' />
            </Button>
            <CardTitle className='text-xl'>
                {monthNames[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
            </CardTitle>
            <Button
                variant='outline'
                size='sm'
                onClick={() => onNavigateMonth(1)}>
                <ChevronRight className='h-4 w-4' />
            </Button>
        </div>
    );
} 