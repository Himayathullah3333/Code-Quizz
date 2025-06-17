"use client";

import type { Participant } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Trophy, Medal, Star } from 'lucide-react';

interface LeaderboardTableProps {
  participants: Participant[];
  currentUserUsername: string | null;
  isFinal?: boolean;
  title?: string;
}

export function LeaderboardTable({ participants, currentUserUsername, isFinal = false, title }: LeaderboardTableProps) {
  const sortedParticipants = [...participants]
    .sort((a, b) => b.score - a.score)
    .map((p, index) => ({ ...p, rank: index + 1 }));

  const getRankIcon = (rank: number | undefined) => {
    if (!rank) return null;
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Award className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-400" />;
    return <Star className="h-5 w-5 text-primary/70" />;
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">
          {title ? title : (isFinal ? "Final Leaderboard" : "Current Standings")}
        </CardTitle>
        {isFinal && <CardDescription>Congratulations to all participants!</CardDescription>}
      </CardHeader>
      <CardContent>
        {sortedParticipants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParticipants.map((participant) => (
                <TableRow
                  key={participant.id}
                  className={participant.username === currentUserUsername ? "bg-primary/10 font-semibold" : ""}
                >
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getRankIcon(participant.rank)}
                      <span>{participant.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${participant.username}.png`} alt={participant.username} />
                        <AvatarFallback>{participant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>
                        {participant.username}
                        {participant.username === currentUserUsername && " (You)"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-lg font-medium">{participant.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">Leaderboard is currently empty.</p>
        )}
      </CardContent>
    </Card>
  );
}
