'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task, type TodoList as TodoListType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isSameMonth,
  parse,
} from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [lists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const startOfTheWeek = startOfWeek(currentDate, { weekStartsOn: 0 });

  const week = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfTheWeek, i));
  }, [startOfTheWeek]);

  const allTasks = useMemo(() => {
    if (!isClient) return [];
    return lists.flatMap(list =>
      list.tasks.map(task => ({
        ...task,
        listName: list.name,
      }))
    );
  }, [lists, isClient]);

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
  
  const taskColorMap: { [key: string]: string } = {
    'My Tasks': 'bg-blue-100 border-blue-400 text-blue-800',
    'Personal': 'bg-green-100 border-green-400 text-green-800',
    'Work': 'bg-purple-100 border-purple-400 text-purple-800',
  };

  const getTaskPosition = (task: Task) => {
    if (!task.date) return { top: 0, height: 0 };
    const taskDate = new Date(task.date);
    const startHour = taskDate.getHours();
    const startMinute = taskDate.getMinutes();
    const duration = task.duration || 60; // Default to 60 minutes
    
    const top = (startHour + startMinute / 60) * 48; // 48px per hour
    const height = (duration / 60) * 48;
    
    return { top: `${top}px`, height: `${height}px` };
  };


  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <h1 className="text-2xl font-semibold text-foreground">Zenith</h1>
          </Link>
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
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline">
              Task List
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="grid flex-1 grid-cols-7">
            {week.map((day, dayIndex) => (
              <div
                key={day.toISOString()}
                className={cn('border-r', {
                  'border-l': dayIndex === 0,
                })}
              >
                <div className="border-b p-2 text-center">
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
                  {getTasksForDay(day).map(task => (
                    <div
                      key={task.id}
                      className={cn(
                        'absolute w-full p-2 rounded-lg border text-xs',
                        taskColorMap[task.listName] || 'bg-gray-100 border-gray-400 text-gray-800'
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
  );
}
