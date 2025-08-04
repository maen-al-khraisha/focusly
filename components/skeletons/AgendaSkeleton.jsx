import { Skeleton } from "@/components/ui/skeleton";

export default function AgendaSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Sheet Cards */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, sheetIndex) => (
          <div key={sheetIndex} className="border rounded-lg p-4 space-y-3">
            {/* Sheet Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Table Skeleton */}
            <div className="overflow-x-auto">
              <div className="border bg-gray-100 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="border-b">
                  <div className="flex">
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                      <div key={colIndex} className="flex-1 p-3">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    ))}
                    <div className="flex-1 p-3">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 3 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="border-b">
                    <div className="flex">
                      {Array.from({ length: 4 }).map((_, colIndex) => (
                        <div key={colIndex} className="flex-1 p-3">
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                      <div className="flex-1 p-3">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-6 w-6" />
                          <Skeleton className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 