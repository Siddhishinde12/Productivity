'use client';

import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Dumbbell,
  LayoutDashboard,
  ListTodo,
  Plane,
  Plus,
  Rocket,
  Moon,
  Sun,
  Calendar,
  DollarSign,
  BookText,
} from 'lucide-react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type TodoList } from '@/types';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lists] = useLocalStorage<TodoList[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>(
    'active-list-id',
    null
  );
  const [isClient, setIsClient] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeList = isClient ? lists.find(list => list.id === activeListId) : undefined;


  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 flex-shrink-0 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground">Zenith</h1>
            </Link>
             {isClient && (
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            )}
        </div>
        {isClient && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start items-center gap-2 mb-8"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>OT</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">
                {activeList?.name || 'My List'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Lists</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {lists.map(list => (
              <DropdownMenuItem
                key={list.id}
                onSelect={() => setActiveListId(list.id)}
              >
                {list.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                // This would ideally open a dialog
                console.log('Create new list');
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        )}
        <nav className="flex flex-col gap-2">
           <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start">
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2" />
              Calendar
            </Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline" className="w-full justify-start">
              <ListTodo className="mr-2" />
              Task List
            </Button>
          </Link>
           <Link href="/diary">
            <Button variant="outline" className="w-full justify-start">
              <BookText className="mr-2" />
              Diary
            </Button>
          </Link>
          <Link href="/money">
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="mr-2" />
              Money Management
            </Button>
          </Link>
          <Link href="/vision-board">
            <Button variant="outline" className="w-full justify-start">
              <Rocket className="mr-2" />
              Vision Board
            </Button>
          </Link>
          <Link href="/gym">
            <Button variant="outline" className="w-full justify-start">
              <Dumbbell className="mr-2" />
              Gym & Health
            </Button>
          </Link>
          <Link href="/travel">
            <Button variant="outline" className="w-full justify-start">
              <Plane className="mr-2" />
              Travel Plans
            </Button>
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
