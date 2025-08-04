"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Edit, CheckSquare, Trash2 } from "lucide-react";

export default function NoteItem({
    note,
    handleEditNote,
    handleConvertToTask,
    handleDeleteNote,
    formatDate,
}) {
    return (
        <Card className='hover:shadow-md transition-shadow'>
            <CardHeader>
                <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                        <CardTitle className='text-lg font-semibold'>
                            {note.title}
                        </CardTitle>
                        <CardDescription className='text-sm text-gray-500'>
                            <div className='flex items-center gap-2'>
                                <span>
                                    {formatDate(note.updatedAt)}
                                </span>
                            </div>
                        </CardDescription>
                    </div>
                    <div className='flex items-center gap-2 ml-4'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEditNote(note)}
                            className='h-8 w-8 p-0'
                            title='Edit Note'>
                            <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleConvertToTask(note)}
                            className='h-8 w-8 p-0 text-green-600 hover:text-green-700'
                            title='Convert to Task'>
                            <CheckSquare className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteNote(note.id)}
                            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                            title='Delete Note'>
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='text-gray-700 whitespace-pre-wrap'>
                    {note.content.length > 200
                        ? `${note.content.substring(0, 200)}...`
                        : note.content}
                </div>
            </CardContent>
        </Card>
    );
}
