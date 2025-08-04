import { Skeleton } from "@/components/ui/skeleton";

export default function HabitsSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            {/* Habit Cards */}
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, habitIndex) => (
                <div key={habitIndex} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32 mt-1" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-2 w-20 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 