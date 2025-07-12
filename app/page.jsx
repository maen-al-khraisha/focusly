import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  Calendar,
  BookOpen,
  Target,
  Timer,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const { userId } = auth();

  if (userId) {
    return redirect('/dashboard');
  }

  const features = [
    {
      icon: CheckCircle,
      title: 'Smart Task Management',
      description:
        'Organize tasks with built-in timers and detailed memo fields',
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'Keep track of deadlines and schedule your productivity',
    },
    {
      icon: BookOpen,
      title: 'Quick Notes',
      description: 'Capture ideas and important information instantly',
    },
    {
      icon: Target,
      title: 'Habit Tracking',
      description: 'Build consistent habits with weekly progress tracking',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">
              Productivity Hub
            </span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Get Started</Button>
          </Link>
          <Link href="/sign-in">Login</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your All-in-One
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}
              Productivity
            </span>{' '}
            Companion
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your workflow with smart task management, habit tracking,
            and note-taking. Everything you need to stay organized and achieve
            your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-3">
                <Timer className="mr-2 h-5 w-5" />
                Start Being Productive
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-3xl mb-2">
                Ready to Transform Your Productivity?
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Join thousands of users who have already streamlined their
                workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-3"
                >
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
