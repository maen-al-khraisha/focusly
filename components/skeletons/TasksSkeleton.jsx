import { Skeleton } from "@/components/ui/skeleton";

export default function TasksSkeleton() {
    return (
        <div className='p-6 space-y-8'>
            {/* Header */}
            <div className='flex justify-end items-center mb-4'>
                <Skeleton className='h-10 w-32' />
            </div>

            {/* Tabs */}
            <div className='flex space-x-4 mb-6'>
                <Skeleton className='h-10 w-24' />
                <Skeleton className='h-10 w-24' />
            </div>

            {/* Task Cards */}
            <div className='space-y-4'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='border rounded-lg p-4 space-y-3'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-3'>
                                <Skeleton className='h-4 w-4' />
                                <Skeleton className='h-6 w-48' />
                            </div>
                            <div className='flex items-center space-x-2'>
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                                <Skeleton className='h-8 w-16' />
                            </div>
                        </div>
                        <Skeleton className='h-4 w-96' />
                        <div className='flex items-center space-x-4'>
                            <Skeleton className='h-4 w-20' />
                            <Skeleton className='h-4 w-32' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
