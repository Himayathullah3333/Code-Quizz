
"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionEntry {
  id: string;
  text: string;
  category: string;
  optionsCount: number;
  correctAnswerPreview: string; // e.g., "Option B" or the text of the answer
}

const initialQuestions: QuestionEntry[] = [
  {
    id: "q1",
    text: "What is the capital of France?",
    category: "Geography",
    optionsCount: 4,
    correctAnswerPreview: "Paris",
  },
  {
    id: "q2",
    text: "Which planet is known as the Red Planet?",
    category: "Science",
    optionsCount: 4,
    correctAnswerPreview: "Mars",
  },
  {
    id: "q3",
    text: "Who wrote '1984'?",
    category: "Literature",
    optionsCount: 4,
    correctAnswerPreview: "George Orwell",
  },
];

export default function AdminQuestionsPage() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionEntry[]>(initialQuestions);

  const handleDeleteQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    // In a real app, this would call an API
    setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
    toast({
      title: "Question Deleted",
      description: `Question "${question?.text.substring(0,30)}..." has been deleted.`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary font-headline">Question Bank</h1>
        <Link href="/admin/questions/new" passHref>
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Question
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">All Questions</CardTitle>
           <CardDescription>
            <p>Manage your quiz questions. Add, edit, or remove them from the bank.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Question Text</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Options</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium truncate max-w-xs">{question.text}</TableCell>
                    <TableCell><Badge variant="outline">{question.category}</Badge></TableCell>
                    <TableCell className="text-center">{question.optionsCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-1 justify-end">
                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary" aria-label="Edit question" onClick={() => toast({ title: "Edit Question", description: "Edit functionality coming soon!", duration: 2000 })}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Delete question">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the question from the bank.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteQuestion(question.id)} className="bg-destructive hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground p-4 text-center">No questions in the bank. Add some to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
