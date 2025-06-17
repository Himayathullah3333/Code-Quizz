
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Users, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">Admin Dashboard</CardTitle>
          <CardDescription>Manage contests, users, and settings from here.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/contests/new" passHref>
            <Button variant="outline" className="w-full h-24 text-lg flex flex-col items-center justify-center p-4 hover:bg-primary/10">
              <PlusCircle className="h-8 w-8 mb-2 text-primary" />
              Create New Contest
            </Button>
          </Link>
          <Link href="/admin/contests" passHref>
             <Button variant="outline" className="w-full h-24 text-lg flex flex-col items-center justify-center p-4 hover:bg-primary/10">
              <LayoutDashboard className="h-8 w-8 mb-2 text-primary" />
              Manage Contests
            </Button>
          </Link>
          <Link href="/admin/users" passHref>
            <Button variant="outline" className="w-full h-24 text-lg flex flex-col items-center justify-center p-4 hover:bg-primary/10">
              <Users className="h-8 w-8 mb-2 text-primary" />
              User Management
            </Button>
          </Link>
           <Link href="/admin/settings" passHref>
            <Button variant="outline" className="w-full h-24 text-lg flex flex-col items-center justify-center p-4 hover:bg-primary/10">
              <Settings className="h-8 w-8 mb-2 text-primary" />
              Application Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
