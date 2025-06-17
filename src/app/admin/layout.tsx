
"use client";
import type { ReactNode } from 'react';
import { QuizMasterLogo } from '@/components/icons/QuizMasterLogo';
import { Button } from '@/components/ui/button';
import { Home, LogOut, UserCircle, Settings, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/contests', label: 'Contests', icon: ShieldAlert },
  { href: '/admin/users', label: 'Users', icon: UserCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary/30 via-background to-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" aria-label="Go to admin dashboard">
            <div className="flex items-center gap-2">
              <QuizMasterLogo />
              <span className="font-headline text-xl text-primary border-l-2 border-primary/50 pl-2 ml-2">Admin Panel</span>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" aria-label="Exit Admin Panel & Go to Homepage">
                <LogOut className="h-6 w-6" />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 container mx-auto">
        <aside className="hidden md:flex flex-col w-64 p-4 space-y-2 border-r border-border/60 bg-card/50 sticky top-20 h-[calc(100vh-5rem)]">
          <nav className="flex-grow">
            <ul className="space-y-1">
              {adminNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} passHref>
                    <Button
                      variant={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-base h-12",
                        (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))) && "font-semibold text-primary"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
           <p className="text-xs text-center text-muted-foreground p-2">
            QuizMaster Admin v1.0
          </p>
        </aside>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
