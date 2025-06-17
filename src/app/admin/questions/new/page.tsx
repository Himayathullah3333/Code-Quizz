
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Option {
  id: string;
  text: string;
}

export default function NewQuestionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [options, setOptions] = useState<Option[]>([
    { id: `option-${Date.now()}-1`, text: "" },
    { id: `option-${Date.now()}-2`, text: "" },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null);

  const handleAddOption = () => {
    if (options.length < 6) { 
      setOptions([...options, { id: `option-${Date.now()}-${options.length + 1}`, text: "" }]);
    } else {
      toast({ title: "Option Limit Reached", description: "You can add a maximum of 6 options.", variant: "default" });
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) { 
      setOptions(options.filter(option => option.id !== id));
      if (correctAnswerId === id) {
        setCorrectAnswerId(null);
      }
    } else {
      toast({ title: "Minimum Options Required", description: "At least 2 options are needed.", variant: "default" });
    }
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(options.map(option => option.id === id ? { ...option, text: value } : option));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const questionText = formData.get("questionText") as string;
    const category = formData.get("category") as string;

    if (!questionText || options.some(opt => !opt.text.trim()) || !correctAnswerId) {
        toast({ title: "Incomplete Form", description: "Please fill all fields and select a correct answer.", variant: "destructive"});
        return;
    }
    toast({
      title: "Question Created",
      description: "New question has been added to the bank (mocked).",
      variant: "default",
    });
    router.push("/admin/questions");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/questions" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary font-headline">Add New Question</h1>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Question Details</CardTitle>
           <CardDescription><p>Define the question, its options, and mark the correct answer.</p></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="questionText" className="text-base">Question Text</Label>
              <Textarea id="questionText" name="questionText" placeholder="e.g., What is the powerhouse of the cell?" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base">Category (Optional)</Label>
              <Input id="category" name="category" placeholder="e.g., Science, History" className="h-12" />
            </div>
            
            <div className="space-y-4">
              <Label className="text-base">Options & Correct Answer</Label>
              <RadioGroup value={correctAnswerId ?? undefined} onValueChange={setCorrectAnswerId}>
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="sr-only">Mark as correct</Label>
                    <Input 
                      value={option.text} 
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      placeholder={`Option ${index + 1}`} 
                      required 
                      className="flex-grow h-11"
                    />
                    {options.length > 2 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveOption(option.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </RadioGroup>
              <Button type="button" variant="outline" onClick={handleAddOption} className="text-sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="bg-success text-success-foreground hover:bg-success/90 h-14 text-lg">
                <PlusCircle className="mr-2 h-6 w-6" />
                Save Question
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
