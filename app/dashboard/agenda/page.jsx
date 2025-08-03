"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AgendaPage() {
    return (
        <div className='p-6 space-y-8'>
            <div className='flex justify-between items-center mb-4'>
                <div>
                    <h1 className='text-2xl font-bold'>Agenda</h1>
                    <p className='text-gray-600'>
                        View and manage your tasks in a calendar-like format
                    </p>
                </div>
            </div>

            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Agenda View</CardTitle>
                        <CardDescription>
                            Calendar and timeline view of your tasks and events
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-center py-12 text-gray-500'>
                            <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                                <svg
                                    className='w-8 h-8 text-gray-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                                    />
                                </svg>
                            </div>
                            <h3 className='text-lg font-medium text-gray-900 mb-2'>
                                Agenda Coming Soon
                            </h3>
                            <p className='text-gray-500 mb-4'>
                                The agenda feature is currently under
                                development.
                            </p>
                            <p className='text-sm text-gray-400'>
                                This will allow you to view and manage your
                                tasks in a calendar-like format with timeline
                                views and scheduling capabilities.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
