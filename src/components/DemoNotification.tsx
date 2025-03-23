
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Clock, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DemoNotification: React.FC = () => {
  const { isDemo, demoTimeRemaining } = useAuth();
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isDemo || demoTimeRemaining === null) return;
    
    // Calculate progress percentage based on 10-minute duration
    const totalDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    const percentage = (demoTimeRemaining / totalDuration) * 100;
    setProgress(percentage);
  }, [isDemo, demoTimeRemaining]);

  if (!isDemo || !isVisible) return null;

  const minutes = Math.floor((demoTimeRemaining || 0) / 60000);
  const seconds = Math.floor(((demoTimeRemaining || 0) % 60000) / 1000);
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed top-20 right-4 z-50 w-64 glass-panel p-4 shadow-lg animate-fadeIn">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-eduOrange">
          <Clock className="h-4 w-4 mr-1.5" />
          <h4 className="font-medium text-sm">Demo Mode</h4>
        </div>
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        You're exploring EduHub in demo mode. Time remaining:
      </p>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{timeDisplay}</span>
        <span className="text-xs text-gray-500">{`${Math.round(progress)}%`}</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
};

export default DemoNotification;
