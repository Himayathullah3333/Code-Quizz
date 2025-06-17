"use client";

import type { Question } from '@/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionIndex: number | null;
  onSelectOption: (optionIndex: number) => void;
  onSubmitAnswer: () => void;
  isSubmitting: boolean; // To disable button during processing
}

export function QuestionCard({
  question,
  selectedOptionIndex,
  onSelectOption,
  onSubmitAnswer,
  isSubmitting
}: QuestionCardProps) {
  
  const альфа = ['A', 'B', 'C', 'D'];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl animate-fadeIn">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl leading-tight text-center">
          {question.questionText}
        </CardTitle>
        {question.category && (
          <CardDescription className="text-center text-sm text-accent pt-1">
            Category: {question.category}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup 
          value={selectedOptionIndex !== null ? String(selectedOptionIndex) : undefined}
          onValueChange={(value) => onSelectOption(parseInt(value))}
          className="space-y-3"
          aria-label="Choose an answer"
        >
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={cn(
                "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedOptionIndex === index
                  ? "bg-primary/20 border-primary ring-2 ring-primary"
                  : "bg-card hover:bg-secondary/70"
              )}
            >
              <RadioGroupItem value={String(index)} id={`option-${index}`} className="h-5 w-5 border-primary text-primary focus:ring-primary" />
              <span className="font-semibold text-primary mr-2">{альфа[index]}.</span>
              <span className="text-base text-foreground">{option}</span>
            </Label>
          ))}
        </RadioGroup>
        <Button
          onClick={onSubmitAnswer}
          disabled={selectedOptionIndex === null || isSubmitting}
          className="w-full h-12 text-lg mt-6 bg-accent hover:bg-accent/90"
          aria-label="Submit Answer"
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </Button>
      </CardContent>
    </Card>
  );
}
