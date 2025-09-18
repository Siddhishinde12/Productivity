'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task, type TodoList as TodoListType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Plus,
  ListTodo,
  Rocket,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Home() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>('active-list-id', null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (lists.length > 0 && !activeListId) {
        setActiveListId(lists[0].id);
      }
    }
  }, [isClient, lists, activeListId, setActiveListId]);

  const activeList = useMemo(
    () => lists.find(list => list.id === activeListId),
    [lists, activeListId]
  );
  
  const startOfTheWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

  const week = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfTheWeek, i));
  }, [startOfTheWeek]);

  const allTasks = useMemo(() => {
    if (!isClient || !activeList) return [];
    return activeList.tasks.map(task => ({
        ...task,
        listName: activeList.name,
      }));
  }, [activeList, isClient]);

  const getTasksForDay = useCallback(
    (day: Date) => {
      return allTasks.filter(
        task => task.date && isSameDay(new Date(task.date), day)
      ).sort((a,b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    },
    [allTasks]
  );
  
  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const getTaskPosition = (task: Task) => {
    if (!task.date) return { top: 0, height: 0 };
    const taskDate = new Date(task.date);
    const startHour = taskDate.getHours();
    const startMinute = taskDate.getMinutes();
    const duration = task.duration || 60; // Default to 60 minutes
    
    const top = (startHour + startMinute / 60) * 64; // 64px per hour
    const height = (duration / 60) * 64;
    
    return { top: `${top}px`, height: `${height}px` };
  };


  if (!isClient) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
       <aside className="w-64 flex-shrink-0 border-r bg-card p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold text-foreground mb-8">Zenith</h1>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start items-center gap-2 mb-8">
               <Avatar className="h-8 w-8">
                 <AvatarImage src="/placeholder.svg" alt="User" />
                 <AvatarFallback>OT</AvatarFallback>
               </Avatar>
               <span className="font-semibold text-lg">{activeList?.name || 'My List'}</span>
             </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Lists</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {lists.map(list => (
              <DropdownMenuItem key={list.id} onSelect={() => setActiveListId(list.id)}>
                {list.name}
              </DropdownMenuItem>
            ))}
             <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => {
                // This would ideally open a dialog
                console.log("Create new list");
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <nav className="flex flex-col gap-2">
          <Link href="/tasks">
            <Button variant="outline" className="w-full justify-start">
              <ListTodo className="mr-2" />
              Task List
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full justify-start">
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/vision-board">
            <Button variant="outline" className="w-full justify-start">
              <Rocket className="mr-2" />
              Vision Board
            </Button>
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-md border p-1">
              <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
                <ChevronLeft />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextWeek}>
                <ChevronRight />
              </Button>
            </div>
            <Button variant="outline" onClick={handleToday}>Today</Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="w-16 flex-shrink-0 text-xs text-center text-muted-foreground">
               <ScrollArea className="h-full">
                <div className="relative">
                  {hours.map(hour => (
                    <div key={hour} className="h-16 border-b flex items-center justify-center">
                     {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </div>
                  ))}
                </div>
               </ScrollArea>
            </div>
            <div className="grid flex-1 grid-cols-7">
              {week.map((day, dayIndex) => (
                <div
                  key={day.toISOString()}
                  className={cn('border-r relative')}
                >
                  <div className="sticky top-0 z-10 bg-background border-b p-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      {dayNames[day.getDay()]}
                    </p>
                    <p
                      className={cn('text-2xl font-bold', {
                        'text-primary': isSameDay(day, new Date()),
                      })}
                    >
                      {format(day, 'd')}
                    </p>
                  </div>
                   <div className="relative h-full">
                    {/* Background hour lines */}
                    {hours.map(hour => (
                      <div key={hour} className="h-16 border-b"></div>
                    ))}
                    {getTasksForDay(day).map(task => (
                      <div
                        key={task.id}
                        className={cn(
                          'absolute w-[95%] ml-[2.5%] p-2 rounded-lg border text-xs shadow-md',
                          'bg-primary/20 border-primary/50 text-primary-foreground'
                        )}
                        style={getTaskPosition(task)}
                      >
                        <p className="font-bold">{task.text}</p>
                        <p>{format(new Date(task.date!), 'h:mm a')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
