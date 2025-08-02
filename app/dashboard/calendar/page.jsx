import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Calendar as CalendarIcon,
    Clock,
    Star,
    CheckCircle,
    Zap,
    Target,
} from "lucide-react";

export default function Calendar() {
    return (
        <div className='p-6 space-y-8'>
            <div>
                <h2 className='text-2xl font-bold text-gray-900'>Calendar</h2>
                <p className='text-gray-600'>
                    Schedule and manage your time effectively
                </p>
            </div>

            <Card className='border-dashed border-2 border-gray-300 bg-gradient-to-br from-blue-50 to-indigo-50'>
                <CardContent className='flex flex-col items-center justify-center py-20'>
                    <div className='w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-8 shadow-lg'>
                        <CalendarIcon className='h-10 w-10 text-blue-600' />
                    </div>

                    <div className='text-center mb-8'>
                        <CardTitle className='text-2xl mb-3 text-gray-800'>
                            🚧 Calendar Feature Coming Soon
                        </CardTitle>
                        <CardDescription className='text-lg max-w-2xl leading-relaxed'>
                            We're building a powerful calendar integration to
                            help you visualize your tasks, schedule work
                            sessions, and track deadlines. This feature will
                            seamlessly connect with your existing tasks and
                            habits.
                        </CardDescription>
                    </div>

                    {/* Progress indicator */}
                    <div className='mb-8'>
                        <div className='flex items-center space-x-2 text-sm text-gray-600'>
                            <CheckCircle className='h-4 w-4 text-green-500' />
                            <span>Task Management</span>
                            <div className='w-8 h-0.5 bg-green-500'></div>
                            <CheckCircle className='h-4 w-4 text-green-500' />
                            <span>Habit Tracking</span>
                            <div className='w-8 h-0.5 bg-gray-300'></div>
                            <div className='w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center'>
                                <span className='text-xs text-gray-500'>3</span>
                            </div>
                            <span className='text-gray-500'>Calendar View</span>
                        </div>
                    </div>

                    {/* Feature preview */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl'>
                        <div className='flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200'>
                            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Clock className='h-6 w-6 text-blue-600' />
                            </div>
                            <div>
                                <div className='font-semibold text-gray-900 mb-1'>
                                    Time Blocking
                                </div>
                                <div className='text-sm text-gray-600 leading-relaxed'>
                                    Schedule focused work sessions and allocate
                                    specific time slots for your tasks.
                                    Visualize your day and optimize
                                    productivity.
                                </div>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200'>
                            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Star className='h-6 w-6 text-purple-600' />
                            </div>
                            <div>
                                <div className='font-semibold text-gray-900 mb-1'>
                                    Priority Planning
                                </div>
                                <div className='text-sm text-gray-600 leading-relaxed'>
                                    Organize tasks by importance and urgency.
                                    Set deadlines and get visual reminders for
                                    upcoming due dates.
                                </div>
                            </div>
                        </div>

                        <div className='flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200'>
                            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                <Target className='h-6 w-6 text-green-600' />
                            </div>
                            <div>
                                <div className='font-semibold text-gray-900 mb-1'>
                                    Goal Tracking
                                </div>
                                <div className='text-sm text-gray-600 leading-relaxed'>
                                    Track progress towards your goals with
                                    visual milestones and achievement
                                    indicators. Stay motivated and focused.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional features */}
                    <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl'>
                        <div className='flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
                            <Zap className='h-5 w-5 text-yellow-500' />
                            <div>
                                <div className='font-medium text-sm text-gray-900'>
                                    Smart Notifications
                                </div>
                                <div className='text-xs text-gray-600'>
                                    Get timely reminders for tasks and deadlines
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
                            <CalendarIcon className='h-5 w-5 text-blue-500' />
                            <div>
                                <div className='font-medium text-sm text-gray-900'>
                                    Integration Ready
                                </div>
                                <div className='text-xs text-gray-600'>
                                    Connect with your existing calendar apps
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to action */}
                    <div className='mt-8 text-center'>
                        <p className='text-sm text-gray-500 mb-2'>
                            Want to be notified when this feature launches?
                        </p>
                        <div className='flex items-center justify-center space-x-2 text-sm text-gray-600'>
                            <CheckCircle className='h-4 w-4 text-green-500' />
                            <span>
                                We'll notify you via email when it's ready!
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
