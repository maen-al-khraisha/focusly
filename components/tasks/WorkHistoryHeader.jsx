"use client";

import { Button } from "@/components/ui/button";

export default function WorkHistoryHeader({
    historyFilter,
    setHistoryFilter,
    showReport,
    setShowReport,
}) {
    return (
        <div className='flex flex-col gap-4 mb-2'>
            <h2 className='text-xl font-bold'>Work History</h2>
            <div className='flex items-center gap-2'>
                <Button
                    size='sm'
                    variant={
                        historyFilter === "daily"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setHistoryFilter("daily")}
                    className={
                        historyFilter === "daily"
                            ? "bg-[#335c67] text-[#fff3b0]"
                            : ""
                    }>
                    Daily
                </Button>
                <Button
                    size='sm'
                    variant={
                        historyFilter === "weekly"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setHistoryFilter("weekly")}
                    className={
                        historyFilter === "weekly"
                            ? "bg-[#335c67] text-[#fff3b0]"
                            : ""
                    }>
                    Weekly
                </Button>
                <Button
                    size='sm'
                    variant={
                        historyFilter === "monthly"
                            ? "default"
                            : "outline"
                    }
                    onClick={() => setHistoryFilter("monthly")}
                    className={
                        historyFilter === "monthly"
                            ? "bg-[#335c67] text-[#fff3b0]"
                            : ""
                    }>
                    Monthly
                </Button>
                <div className='ml-auto'>
                    <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setShowReport(!showReport)}
                        className={`flex items-center gap-2 ${
                            showReport ? "border-accent" : ""
                        }`}>
                        {showReport ? "Hide Report" : "Show Report"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
