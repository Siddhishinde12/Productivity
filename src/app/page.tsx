'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task, type TodoList as TodoListType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isToday
} from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import TodayTodoList from '@/components/today-todo-list';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Home() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId] = useLocalStorage<string | null>('active-list-id', null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (lists.length === 0) {
        // Set default lists if none exist
        const defaultList: TodoListType = {
          id: Date.now().toString(),
          name: 'My Tasks',
          tasks: [
            { id: '1', text: 'Finish report for Q2', completed: false, date: new Date().toISOString(), duration: 120 },
            { id: '2', text: 'Schedule a dentist appointment', completed: true, date: new Date(new Date().setHours(14,0,0,0)).toISOString(), duration: 45 },
            { id: '3', text: 'Pick up groceries', completed: false, date: new Date(new Date().setHours(17,30,0,0)).toISOString(), duration: 60 },
          ],
        };
         setLists([defaultList]);
      }
    }
  }, [isClient, lists.length, setLists]);

  const activeList = useMemo(
    () => lists.find(list => list.id === activeListId) ?? lists[0],
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
  
  const todayTasks = useMemo(() => {
     if (!isClient || !activeList) return [];
     return activeList.tasks.filter(task => task.date && isToday(new Date(task.date)));
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
    <div className="flex flex-1 h-full">
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
                  {/* Empty space for day headers */}
                  <div className="h-[73px] border-b"></div>
                  {hours.map(hour => (
                    <div key={hour} className="h-16 border-b flex items-center justify-center">
                     <span className="relative -top-3">{hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}</span>
                    </div>
                  ))}
                </div>
               </ScrollArea>
            </div>
            <div className="grid flex-1 grid-cols-7">
              {week.map((day) => (
                <div
                  key={day.toISOString()}
                  className={cn('border-r relative')}
                >
                  <div className="sticky top-0 z-10 bg-background border-b p-2 text-center h-[73px]">
                    <p className="text-sm text-muted-foreground">
                      {dayNames[day.getDay()]}
                    </p>
                    <p
                      className={cn('text-2xl font-bold', {
                        'text-primary bg-primary/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto': isSameDay(day, new Date()),
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
      <aside className="w-80 flex-shrink-0 border-l bg-card p-4">
          <TodayTodoList tasks={todayTasks} />
      </aside>
    </div>
  );
}
