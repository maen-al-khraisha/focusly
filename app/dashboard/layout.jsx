"use client";

import { useState } from "react";
import Link from "next/link";

import { UserButton, useUser } from "@clerk/nextjs";

import logo from "../../public/img/logo.png";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    CheckCircle,
    Calendar,
    BookOpen,
    Target,
    Menu,
    X,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import DarkModeToggle from "@/components/DarkModeToggle";

const navigation = [
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckCircle },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Notes", href: "/dashboard/notes", icon: BookOpen },
    { name: "Habits", href: "/dashboard/habits", icon: Target },
];

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const { user } = useUser();
    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <div className='min-h-screen bg-secondary-100'>
            {/* Mobile sidebar */}
            <div
                className={cn(
                    "fixed inset-0 z-50 lg:hidden",
                    sidebarOpen ? "block" : "hidden"
                )}>
                <div
                    className='fixed inset-0 bg-primary-700 bg-opacity-75'
                    onClick={() => setSidebarOpen(false)}
                />
                <div className='fixed inset-y-0 left-0 flex w-64 flex-col'>
                    <Card className='flex flex-1 flex-col rounded-none border-0 bg-primary-50'>
                        <div className='flex h-16 shrink-0 items-center justify-between px-4'>
                            <div className='flex items-center space-x-2'>
                                <Image
                                    src={logo}
                                    width={40}
                                    height={40}
                                    alt='Logo'
                                />
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => setSidebarOpen(false)}>
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                        <nav className='flex flex-1 flex-col px-4 pb-4'>
                            <UserButton />
                            <ul className='flex flex-1 flex-col gap-y-2'>
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors",
                                                pathname === item.href
                                                    ? "bg-accent text-primary-900"
                                                    : "text-primary-900 hover:bg-secondary-200 hover:text-primary-900"
                                            )}
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }>
                                            <item.icon className='h-5 w-5 shrink-0' />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Card>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col border-r border-secondary-300'>
                <Card className='flex flex-1 flex-col rounded-none border-0 shadow-lg bg-primary-50'>
                    <div className='flex h-auto shrink-0 items-center px-4'>
                        <Link href='/'>
                            <Image
                                src={logo}
                                width={100}
                                height={100}
                                alt='Logo'
                            />
                        </Link>
                    </div>
                    <nav className='flex flex-1 flex-col px-4 pb-4 mt-5 gap-5'>
                        <ul className='flex flex-1 flex-col gap-y-2'>
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors",
                                            pathname === item.href
                                                ? "bg-accent text-primary-900"
                                                : "text-primary-900 hover:bg-secondary-200 hover:text-primary-900"
                                        )}>
                                        <item.icon className='h-5 w-5 shrink-0' />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </Card>
            </div>

            {/* Main content */}
            <div className='lg:pl-64 '>
                <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-secondary-300 bg-transparent px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='lg:hidden'
                        onClick={() => setSidebarOpen(true)}>
                        <Menu className='h-5 w-5' />
                    </Button>
                    <div className='flex flex-1 gap-x-4 self-stretch justify-between items-center lg:gap-x-6'>
                        <div className='flex items-center'>
                            <h1 className='text-xl font-semibold text-primary-900'>
                                {navigation.find(
                                    (item) => item.href === pathname
                                )?.name || "Dashboard"}
                            </h1>
                        </div>

                        <div className='flex items-center gap-x-4'>
                            <DarkModeToggle className='m-5' />

                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonBox: "custom-user-button-box",
                                        userButtonTrigger:
                                            "custom-user-button-trigger",
                                        userButtonAvatarBox:
                                            "custom-user-button-avatar-box",
                                        userButtonPopoverCard:
                                            "custom-user-button-popover-card",
                                        userButtonPopoverActionButton:
                                            "custom-user-button-popover-action-button",
                                        userButtonPopoverActionButtonText:
                                            "custom-user-button-popover-action-button-text",
                                        userButtonPopoverActionButtonIcon:
                                            "custom-user-button-popover-action-button-icon",
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <main className='py-8 px-8 bg-transparent h-[calc(100vh-64px)]'>
                    <div className='mx-auto max-w-7xl    bg-white rounded-xl shadow-md'>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
