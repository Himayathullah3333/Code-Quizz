
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ListChecks, ClipboardEdit, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  link?: string;
  linkText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, description, link, linkText }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="text-3xl font-bold text-primary font-headline">{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
    {link && linkText && (
      <div className="p-4 pt-0 mt-auto">
        <Link href={link} passHref>
          <Button variant="outline" className="w-full group">
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    )}
  </Card>
);

export default function AdminDashboardPage() {
  const stats = {
    totalContests: "5", 
    activeContests: "2", 
    totalUsers: "150",   
    questionsInBank: "75" 
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-primary font-headline tracking-tight">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Contests" 
          value={stats.totalContests} 
          icon={ListChecks}
          description="Number of all created contests."
          link="/admin/contests"
          linkText="Manage Contests"
        />
        <StatCard 
          title="Active Contests" 
          value={stats.activeContests} 
          icon={ListChecks} 
          description="Contests currently running."
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users}
          description="Overall user engagement."
          link="/admin/users"
          linkText="View Users"
        />
        <StatCard 
          title="Question Bank" 
          value={stats.questionsInBank} 
          icon={ClipboardEdit}
          description="Total questions available."
          link="/admin/questions"
          linkText="Manage Questions"
        />
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold font-headline text-primary">Quick Actions</CardTitle>
          <CardDescription>
            <p>Access key administrative functions quickly.</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/contests/new" passHref>
            <Button size="lg" className="w-full h-16 text-lg bg-success hover:bg-success/90 text-success-foreground">
              <ListChecks className="mr-2 h-6 w-6" /> Generate New Contest
            </Button>
          </Link>
          <Link href="/admin/questions/new" passHref>
            <Button size="lg" className="w-full h-16 text-lg">
              <ClipboardEdit className="mr-2 h-6 w-6" /> Add New Question
            </Button>
          </Link>
          <Link href="/admin/settings" passHref>
            <Button variant="outline" size="lg" className="w-full h-16 text-lg">
              <SlidersHorizontal className="mr-2 h-6 w-6" /> System Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold font-headline text-primary">Recent Activity</CardTitle>
           <CardDescription>
            <p>Overview of recent admin actions or system events (placeholder).</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity to display.</p>
        </CardContent>
      </Card>

    </div>
  );
}
