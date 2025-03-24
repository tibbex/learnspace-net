
import React from 'react';
import { useAuth } from './AuthContext';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const DemoNotification: React.FC = () => {
  const { isDemo, demoTimeRemaining } = useAuth();

  if (!isDemo || !demoTimeRemaining) return null;

  // Format the time remaining
  const minutes = Math.floor(demoTimeRemaining / 60000);
  const seconds = Math.floor((demoTimeRemaining % 60000) / 1000);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <Card className="mb-6 p-4 bg-amber-50 border-amber-200 text-amber-700 flex items-center gap-2">
      <Clock className="h-5 w-5" />
      <div>
        <p className="font-medium">Demo Mode Active</p>
        <p className="text-sm">Time remaining: {formattedTime}</p>
      </div>
    </Card>
  );
};

export default DemoNotification;
