
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function NewContestPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Contest Generation Initiated",
      description: "Your new contest is being created (mocked).",
      variant: "default",
    });
    router.push("/admin/contests");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/contests" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary font-headline">Generate New Contest</h1>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Contest Details</CardTitle>
          <CardDescription>
            <p>Fill in the information below to create a new contest. Question management will be handled separately or in an advanced section.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contestName" className="text-base">Contest Name</Label>
              <Input id="contestName" placeholder="e.g., Weekly Tech Trivia" required className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contestDescription" className="text-base">Description (Optional)</Label>
              <Textarea id="contestDescription" placeholder="A brief description of the contest." />
            </div>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Advanced Settings (Placeholder)</CardTitle>
                 <CardDescription><p>Future options for question selection, duration, etc.</p></CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  In a full implementation, you might select questions from a bank, set time limits, define scoring rules, etc.
                </p>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" className="bg-success text-success-foreground hover:bg-success/90 h-14 text-lg">
                <PlusCircle className="mr-2 h-6 w-6" />
                Create Contest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
