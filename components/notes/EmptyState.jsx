"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Plus, FolderOpen } from "lucide-react";

export default function EmptyState({
    setIsDialogOpen,
    setIsCategoryDialogOpen,
}) {
    return (
        <div className='text-center py-12'>
            <BookOpen className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No notes yet
            </h3>
            <p className='text-gray-500 mb-6'>
                Create your first note to get started
            </p>
            <div className='flex items-center justify-center gap-3'>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Create Your First Note
                </Button>
                <Button
                    variant='outline'
                    onClick={() => setIsCategoryDialogOpen(true)}
                    className='bg-green-50 border-green-200 text-green-700 hover:bg-green-100'>
                    <FolderOpen className='mr-2 h-4 w-4' />
                    Add Category
                </Button>
            </div>
        </div>
    );
}
