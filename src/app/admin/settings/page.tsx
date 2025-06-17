
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary font-headline">System Settings</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center">
            <Settings className="mr-3 h-6 w-6 text-primary" />
            Application Configuration (Placeholder)
          </CardTitle>
          <CardDescription>
            <p>This section will allow administrators to configure various aspects of the QuizMaster application, such as default contest settings, theme customization, integrations, etc.</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg bg-muted/50">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Settings page is currently under development.</p>
            <p className="text-sm text-muted-foreground">Advanced configuration options will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
