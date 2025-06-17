
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Play, Square, Edit3, Trash2, BarChart3 } from 'lucide-react';
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

interface ContestEntry {
  id: string;
  name: string;
  code: string;
  status: "pending" | "active" | "finished";
  created: string;
  participantCount: number;
}

const initialContests: ContestEntry[] = [
  {
    id: "CONTEST123", // Ensure this matches mockContest.id for localStorage key consistency
    name: "Tech Trivia Night",
    code: "3PHGAM",
    status: "pending",
    created: "2024-07-15",
    participantCount: 0,
  },
  {
    id: "contest-2",
    name: "History Buffs Challenge",
    code: "HSTRY1",
    status: "active",
    created: "2024-07-10",
    participantCount: 25,
  },
  {
    id: "contest-3",
    name: "Science Quiz Weekly",
    code: "SCIWK5",
    status: "finished",
    created: "2024-07-01",
    participantCount: 50,
  },
];

const LOCAL_STORAGE_ADMIN_STATUS_PREFIX = "quizmaster-contest-";

export default function AdminContestsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [contests, setContests] = useState<ContestEntry[]>(initialContests);

  const handleStartContest = (contestId: string) => {
    setContests(prevContests =>
      prevContests.map(c =>
        c.id === contestId ? { ...c, status: 'active', participantCount: c.participantCount || 5 } : c 
      )
    );
    const contest = contests.find(c => c.id === contestId);
    localStorage.setItem(`${LOCAL_STORAGE_ADMIN_STATUS_PREFIX}${contestId}-adminStatus`, 'active');
    toast({
      title: "Contest Started",
      description: `Contest ${contest?.name} (${contest?.code}) is now active. Participants will be moved from the waiting room.`,
    });
  };

  const handleStopContest = (contestId: string) => {
    setContests(prevContests =>
      prevContests.map(c =>
        c.id === contestId ? { ...c, status: 'finished' } : c
      )
    );
    const contest = contests.find(c => c.id === contestId);
    localStorage.setItem(`${LOCAL_STORAGE_ADMIN_STATUS_PREFIX}${contestId}-adminStatus`, 'finished');
    toast({
      title: "Contest Finished",
      description: `Contest ${contest?.name} (${contest?.code}) has been marked as finished.`,
    });
  };

  const handleDeleteContest = (contestId: string) => {
    const contest = contests.find(c => c.id === contestId);
    setContests(prevContests => prevContests.filter(c => c.id !== contestId));
    localStorage.removeItem(`${LOCAL_STORAGE_ADMIN_STATUS_PREFIX}${contestId}-adminStatus`);
    toast({
      title: "Contest Deleted",
      description: `Contest ${contest?.name} (${contest?.code}) has been deleted.`,
      variant: "destructive",
    });
  };

  const getStatusBadgeVariant = (status: ContestEntry["status"]): "default" | "secondary" | "destructive" | "outline" => {
    if (status === 'active') return 'default'; 
    if (status === 'pending') return 'secondary'; 
    if (status === 'finished') return 'outline'; 
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary font-headline">Contest Management</h1>
        <Link href="/admin/contests/new" passHref>
          <Button className="bg-success text-success-foreground hover:bg-success/90 w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" />
            Generate New Contest
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">All Contests</CardTitle>
          <CardDescription>
            <p>View, manage, and create new contests.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Participants</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contests.map((contest) => (
                  <TableRow key={contest.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{contest.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-mono">{contest.code}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(contest.status)} className="capitalize">
                        {contest.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{contest.participantCount}</TableCell>
                    <TableCell>{contest.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-success hover:bg-success/10 hover:text-success disabled:text-muted-foreground"
                          aria-label="Start contest"
                          onClick={() => handleStartContest(contest.id)}
                          disabled={contest.status !== 'pending'}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive disabled:text-muted-foreground"
                          aria-label="Stop contest"
                          onClick={() => handleStopContest(contest.id)}
                          disabled={contest.status !== 'active'}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 hover:text-primary" aria-label="Edit contest" onClick={() => toast({ title: "Edit Contest", description: "Edit functionality coming soon!", duration: 2000 })}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" className="text-accent hover:bg-accent/10 hover:text-accent" aria-label="View leaderboard" onClick={() => toast({ title: "View Leaderboard", description: "Leaderboard view coming soon!", duration: 2000 })}>
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Delete contest">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the contest
                                and all related data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteContest(contest.id)} className="bg-destructive hover:bg-destructive/90">
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
            <p className="text-muted-foreground p-4 text-center">No contests available. Generate one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
