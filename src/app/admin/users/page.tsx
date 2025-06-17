
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">User Management</h1>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Users className="mr-3 h-6 w-6 text-primary" />
            All Users (Placeholder)
          </CardTitle>
          <CardDescription>
            <p>This section will display a list of all registered users or participants from contests. Functionality to manage users (e.g., view details, ban, etc.) will be implemented here.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg bg-muted/50">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">User management features are under construction.</p>
            <p className="text-sm text-muted-foreground">Check back later for updates!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
