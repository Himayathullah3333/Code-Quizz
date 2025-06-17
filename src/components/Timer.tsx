"use client";

import { useEffect, useState } from 'react';
import { TimerIcon } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface TimerProps {
  initialTime: number; // in seconds
  currentTime: number;
  isActive: boolean;
}

export function Timer({ initialTime, currentTime, isActive }: TimerProps) {
  const [progressValue, setProgressValue] = useState(100);

  useEffect(() => {
    if (isActive) {
      setProgressValue((currentTime / initialTime) * 100);
    }
  }, [currentTime, initialTime, isActive]);

  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;

  const timeColor = currentTime <= 5 ? "text-destructive" : currentTime <= 10 ? "text-yellow-500" : "text-primary";

  return (
    <div className="flex flex-col items-center space-y-2 p-4 rounded-lg shadow-md bg-card w-full max-w-xs mx-auto">
      <div className="flex items-center space-x-2">
        <TimerIcon className={`h-8 w-8 ${timeColor}`} />
        <span className={`text-4xl font-bold font-mono ${timeColor}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      <Progress value={progressValue} className="w-full h-3 [&>div]:bg-primary" aria-label={`Time left: ${currentTime} seconds`} />
      <p className="text-sm text-muted-foreground">Time Remaining</p>
    </div>
  );
}
