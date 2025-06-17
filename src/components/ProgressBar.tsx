"use client";

import { Progress } from "@/components/ui/progress";

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2 text-sm font-medium">
        <span className="text-primary">Question {Math.min(current + 1, total)} of {total}</span>
        <span className="text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
      </div>
      <Progress value={progressPercentage} className="h-3 w-full [&>div]:bg-accent" aria-label={`Quiz progress: ${progressPercentage}%`}/>
    </div>
  );
}
