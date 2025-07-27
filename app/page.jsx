"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

import logo from "../public/img/logo.png";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CheckCircle,
    Calendar,
    BookOpen,
    Target,
    Timer,
    Sparkles,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function Home() {
    const { user } = useUser();

    const router = useRouter();

    const handleSignin = () => {
        router.push("/sign-in");
    };

    if (user) {
        return redirect("/dashboard");
    }

    const features = [
        {
            icon: CheckCircle,
            title: "Smart Task Management",
            description:
                "Organize tasks with built-in timers and detailed memo fields",
        },
        {
            icon: Calendar,
            title: "Calendar Integration",
            description:
                "Keep track of deadlines and schedule your productivity",
        },
        {
            icon: BookOpen,
            title: "Quick Notes",
            description: "Capture ideas and important information instantly",
        },
        {
            icon: Target,
            title: "Habit Tracking",
            description:
                "Build consistent habits with weekly progress tracking",
        },
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-secondary-100 via-secondary-500 to-accent-100'>
            {/* Header */}
            <header className='container mx-auto px-4 py-6'>
                <nav className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <Image
                            src={logo}
                            width={70}
                            height={70}
                            alt='logo'></Image>
                    </div>
                    <div className='flex items-center gap-4'>
                        <Link href='/dashboard'>
                            <Button variant='outline'>Get Started</Button>
                        </Link>
                        {!user && <Button onClick={handleSignin}>Login</Button>}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <main className='container mx-auto px-4 py-12'>
                <div className='text-center max-w-4xl mx-auto'>
                    <h1 className='text-5xl md:text-6xl font-bold text-primary mb-6'>
                        Your All-in-One
                        <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600'>
                            {" "}
                            Productivity
                        </span>{" "}
                        Companion
                    </h1>
                    <p className='text-xl text-secondary mb-8 max-w-2xl mx-auto'>
                        Streamline your workflow with smart task management,
                        habit tracking, and note-taking. Everything you need to
                        stay organized and achieve your goals.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link href='/dashboard'>
                            <Button size='lg' className='text-lg px-8 py-3'>
                                <Timer className='mr-2 h-5 w-5' />
                                Start Being Productive
                            </Button>
                        </Link>
                        <Button
                            size='lg'
                            variant='outline'
                            className='text-lg px-8 py-3'>
                            Learn More
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className='mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className='border-0 shadow-lg hover:shadow-xl transition-shadow duration-300'>
                            <CardHeader className='text-center'>
                                <div className='mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                                    <feature.icon className='h-6 w-6 text-blue-600' />
                                </div>
                                <CardTitle className='text-lg'>
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className='text-center'>
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* CTA Section */}
                <div className='mt-20 text-center'>
                    <Card className='max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
                        <CardHeader>
                            <CardTitle className='text-3xl mb-2'>
                                Ready to Transform Your Productivity?
                            </CardTitle>
                            <CardDescription className='text-blue-100 text-lg'>
                                Join thousands of users who have already
                                streamlined their workflow
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href='/dashboard'>
                                <Button
                                    size='lg'
                                    variant='secondary'
                                    className='text-lg px-8 py-3'>
                                    Get Started Now - It's Free
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
