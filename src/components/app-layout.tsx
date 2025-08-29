'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, LayoutGrid, Settings, Share2, ShieldAlert, FileText, LineChart, Loader2, User, Bug, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import type { User as AuthUser } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThemeSwitcher } from './theme-switcher';

const navItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/activity', icon: LineChart, label: 'Activity' },
  { href: '/nodes', icon: Share2, label: 'Nodes' },
  { href: '/alerts', icon: ShieldAlert, label: 'Alerts' },
  { href: '/pest-management', icon: Bug, label: 'Pest Management' },
  { href: '/assistant', icon: MessageSquare, label: 'Assistant' },
  { href: '/logs', icon: FileText, label: 'Logs' },
  { href: '/profile', icon: User, label: 'Profile' }, // ✅ Added Profile route
];

const mobileNavItems = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/activity', icon: LineChart, label: 'Activity' },
  { href: '/nodes', icon: Share2, label: 'Nodes' },
  { href: '/alerts', icon: ShieldAlert, label: 'Alerts' },
  { href: '/assistant', icon: MessageSquare, label: 'Assistant' },
  { href: '/profile', icon: User, label: 'Profile' }, // ✅ Added Profile to mobile nav
];

const settingsItem = { href: '/settings', icon: Settings, label: 'Settings' };

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm md:justify-end">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-6" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        <ThemeSwitcher />
      </div>
    </header>
  );
}

function AppSidebar({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          aria-label="Farm Sentinel Home"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <path
              d="M16 0L29.8564 8V24L16 32L2.14359 24V8L16 0Z"
              fill="url(#paint0_linear_1_2)"
            />
            <path
              d="M16 3.0641L27.7128 9.5V22.5L16 28.9359L4.28718 22.5V9.5L16 3.0641Z"
              fill="url(#paint1_linear_1_2)"
            />
            <path
              d="M16 5.89744L25.5692 11V21L16 26.1026L6.43077 21V11L16 5.89744Z"
              fill="url(#paint2_linear_1_2)"
            />
            <path
              d="M16 8.73077L22.2564 12.25V19.75L16 23.2692L9.74359 19.75V12.25L16 8.73077Z"
              fill="url(#paint3_linear_1_2)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_1_2"
                x1="16"
                y1="0"
                x2="16"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00A99D" />
                <stop offset="1" stopColor="#00E5D7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1_2"
                x1="16"
                y1="3.0641"
                x2="16"
                y2="28.9359"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2D295D" />
                <stop offset="1" stopColor="#252159" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1_2"
                x1="16"
                y1="5.89744"
                x2="16"
                y2="26.1026"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00A99D" />
                <stop offset="1" stopColor="#00E5D7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1_2"
                x1="16"
                y1="8.73077"
                x2="16"
                y2="23.2692"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2D295D" />
                <stop offset="1" stopColor="#252159" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">
            Farm Sentinel
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={{
                  children: item.label,
                  side: 'right',
                  align: 'center',
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === settingsItem.href}
              tooltip={{
                children: settingsItem.label,
                side: 'right',
                align: 'center',
              }}
            >
              <Link href={settingsItem.href}>
                <settingsItem.icon />
                <span>{settingsItem.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="my-1" />
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto w-full justify-start p-2 text-left"
              tooltip={{
                children: (
                  <div className="text-left">
                    <div className="font-bold">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                ),
                side: 'right',
                align: 'start',
              }}
            >
              <Link href="/settings">
                <Avatar className="size-9">
                  <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person portrait" alt={user?.name ?? ''} />
                  <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-2 flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold leading-none">{user?.name}</span>
                  <span className="text-xs leading-none text-muted-foreground">{user?.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function BottomNavBar() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 z-10 w-full border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground',
              pathname === item.href ? 'text-primary' : 'text-foreground/70'
            )}
          >
            <item.icon className="size-6" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}

const PUBLIC_PAGES = ['/', '/signin', '/signup'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = PUBLIC_PAGES.includes(pathname);

  useEffect(() => {
    if (loading) return; 

    if (!user && !isPublicPage) {
      router.replace('/');
    }
  }, [user, loading, isPublicPage, router, pathname]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
            {children}
          </main>
          <BottomNavBar />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
