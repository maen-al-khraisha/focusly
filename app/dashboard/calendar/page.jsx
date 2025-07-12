import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, Star } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
        <p className="text-gray-600">Schedule and manage your time effectively</p>
      </div>

      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl mb-2">Calendar View Coming Soon</CardTitle>
          <CardDescription className="text-center max-w-md">
            We're working on an integrated calendar view to help you schedule tasks, 
            set deadlines, and manage your time more effectively.
          </CardDescription>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium text-sm">Time Blocking</div>
                <div className="text-xs text-gray-600">Schedule focused work sessions</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Star className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium text-sm">Priority Planning</div>
                <div className="text-xs text-gray-600">Organize by importance</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium text-sm">Deadline Tracking</div>
                <div className="text-xs text-gray-600">Never miss important dates</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}