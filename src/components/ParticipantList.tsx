"use client";

import type { Participant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
  currentUserUsername: string | null;
}

export function ParticipantList({ participants, currentUserUsername }: ParticipantListProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-headline">
          <Users className="h-6 w-6 text-primary" />
          Joined Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length > 0 ? (
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {participants.map((participant) => (
              <li
                key={participant.id}
                className={`flex items-center space-x-3 p-3 rounded-md transition-all duration-300 ease-in-out ${
                  participant.username === currentUserUsername 
                    ? 'bg-primary/10 ring-2 ring-primary shadow-md' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <Avatar className="h-10 w-10 border-2 border-primary/50">
                  <AvatarImage src={`https://avatar.vercel.sh/${participant.username}.png`} alt={participant.username} />
                  <AvatarFallback>{participant.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className={`font-medium ${participant.username === currentUserUsername ? 'text-primary' : 'text-foreground'}`}>
                  {participant.username}
                  {participant.username === currentUserUsername && " (You)"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No participants yet. Be the first to join!</p>
        )}
      </CardContent>
    </Card>
  );
}
