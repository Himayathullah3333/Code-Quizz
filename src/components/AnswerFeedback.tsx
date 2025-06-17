"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnswerFeedbackProps {
  isCorrect: boolean | null;
  correctAnswer: string | null;
  selectedAnswerText?: string | null; // Optional: text of the user's selected answer
}

export function AnswerFeedback({ isCorrect, correctAnswer, selectedAnswerText }: AnswerFeedbackProps) {
  if (isCorrect === null || correctAnswer === null) {
    // This case should ideally not happen if feedback is only shown after an answer.
    return (
       <Card className="w-full max-w-md mx-auto shadow-lg animate-fadeIn border-yellow-500 bg-yellow-50">
        <CardHeader className="items-center text-center">
            <Info className="h-12 w-12 text-yellow-500 mb-2" />
            <CardTitle className="font-headline text-2xl text-yellow-700">Processing...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <CardDescription className="text-yellow-600">Waiting for results.</CardDescription>
        </CardContent>
      </Card>
    );
  }

  const animationClass = isCorrect ? 'animate-pulse-correct' : 'animate-pulse-incorrect';

  return (
    <Card 
      className={cn(
        "w-full max-w-md mx-auto shadow-xl",
        animationClass,
        isCorrect ? "border-success bg-success/10" : "border-destructive bg-destructive/10"
      )}
    >
      <CardHeader className="items-center text-center">
        {isCorrect ? (
          <CheckCircle2 className="h-16 w-16 text-success mb-3" />
        ) : (
          <XCircle className="h-16 w-16 text-destructive mb-3" />
        )}
        <CardTitle className={cn(
          "font-headline text-3xl",
          isCorrect ? "text-success" : "text-destructive"
        )}>
          {isCorrect ? "Correct!" : "Incorrect"}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        {selectedAnswerText && (
           <p className={cn("text-lg", isCorrect ? "text-gray-700" : "text-gray-700")}>
            Your answer: <span className="font-semibold">{selectedAnswerText}</span>
          </p>
        )}
        {!isCorrect && (
          <p className="text-lg text-gray-700">
            The correct answer was: <span className="font-semibold text-success">{correctAnswer}</span>
          </p>
        )}
         <p className="text-sm text-muted-foreground pt-2">
          Next part starting soon...
        </p>
      </CardContent>
    </Card>
  );
}
