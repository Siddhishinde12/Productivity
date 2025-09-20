'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  setHours,
  setMinutes,
  isToday,
  getDay,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import TodayTodoList from '@/components/today-todo-list';
import { INDIAN_FESTIVALS_2024, type Festival } from '@/lib/festivals';


const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const hours = Array.from({ length: 20 }, (_, i) => i + 5); // 5 AM to 12 AM (midnight)

const festivalMap: Map<string, string> = new Map(
  INDIAN_FESTIVALS_2024.map(f => [f.date, f.name])
);

export default function Home() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>(
    'active-list-id',
    null
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isClient, setIsClient] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState(0);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    const updateCurrentTime = () => {
      const now = new Date();
      const position = (now.getHours() - 5 + now.getMinutes() / 60) * 64;
      setCurrentTimePosition(position);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(intervalId);
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
        if (!activeListId) {
          setActiveListId(defaultList.id);
        }
      } else if (!activeListId) {
        setActiveListId(lists[0].id);
      }
    }
  }, [isClient, lists, setLists, activeListId, setActiveListId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      // Scroll to a position around the current time, e.g., 2 hours before
      const scrollPosition = Math.max(0, currentTimePosition - 128);
      scrollAreaRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
  }, [isClient, currentTimePosition]);

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
    return activeList.tasks;
  }, [activeList, isClient]);
  
  const todaysTasks = useMemo(() => {
    return allTasks.filter(task => task.date && isToday(new Date(task.date)));
  }, [allTasks]);

  const getTasksForDay = useCallback(
    (day: Date) => {
      return allTasks
        .filter(task => task.date && isSameDay(new Date(task.date), day))
        .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    },
    [allTasks]
  );

  const handleAddTask = (taskDetails: { title: string, description: string, date: Date | undefined, time: string, duration: number }) => {
    if (!activeListId) return false;
     if (!taskDetails.title) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Task title cannot be empty.',
        });
        return false;
    }
    const [hours, minutes] = taskDetails.time.split(':').map(Number);
    const finalDate = setMinutes(setHours(taskDetails.date || new Date(), hours), minutes);

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskDetails.title,
      description: taskDetails.description,
      completed: false,
      date: finalDate.toISOString(),
      duration: taskDetails.duration,
    };
    const updatedLists = lists.map(list =>
      list.id === activeListId
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );
    setLists(updatedLists);
    toast({
        title: 'Event Added!',
        description: 'Your new event has been added to the calendar.',
    })
    return true;
  };

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

    const top = (startHour - 5 + startMinute / 60) * 64; // 64px per hour, starting from 5 AM
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
            <Button variant="outline" onClick={handleToday}>
              Today
            </Button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
           <AddEventDialog onAddTask={handleAddTask} />
        </header>
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="flex h-full">
              <div className="w-16 flex-shrink-0 text-xs text-center text-muted-foreground">
                <div className="relative">
                    {/* Empty space for day headers */}
                    <div className="h-[73px] border-b"></div>
                    {hours.map(hour => (
                      <div
                        key={hour}
                        className="h-16 border-b flex items-center justify-center"
                      >
                        <span className="relative -top-3">
                          {hour === 24
                            ? '12 AM'
                            : hour < 12
                            ? `${hour} AM`
                            : hour === 12
                            ? '12 PM'
                            : `${hour - 12} PM`}
                        </span>
                      </div>
                    ))}
                  </div>
              </div>
              <div className="grid flex-1 grid-cols-7 relative">
                {week.map(day => {
                  const dayOfWeek = getDay(day);
                  const isSunday = dayOfWeek === 0;
                  const festival = festivalMap.get(format(day, 'yyyy-MM-dd'));

                  return (
                  <div key={day.toISOString()} className={cn('border-r relative', isSunday && 'bg-muted/30')}>
                    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b p-2 text-center h-[73px]">
                      <p className="text-sm text-muted-foreground">
                        {dayNames[day.getDay()]}
                      </p>
                      <p
                        className={cn('text-2xl font-bold', {
                          'text-primary bg-primary/20 rounded-full w-10 h-10 flex items-center justify-center mx-auto': isSameDay(
                            day,
                            new Date()
                          ),
                        })}
                      >
                        {format(day, 'd')}
                      </p>
                      {festival && (
                          <p className="text-[10px] text-purple-600 font-semibold truncate mt-1">
                              {festival}
                          </p>
                      )}
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
                            'bg-primary/20 border-primary/50 text-primary-foreground',
                            task.completed && 'opacity-50 bg-secondary border-secondary/50'
                          )}
                          style={getTaskPosition(task)}
                        >
                          <p className={cn('font-bold', task.completed && 'line-through')}>
                            {task.text}
                          </p>
                           {task.duration && (
                              <p>
                                {format(new Date(task.date!), 'h:mm a')} ({task.duration} min)
                              </p>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )})}
                 {isSameDay(currentDate, new Date()) && (
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
                    style={{ top: `${currentTimePosition + 73}px` }}
                  >
                    <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
      <aside className="w-80 flex-shrink-0 border-l bg-card p-4">
        <TodayTodoList tasks={todaysTasks} />
      </aside>
    </div>
  );
}


function AddEventDialog({ onAddTask }: { onAddTask: (details: { title: string, description: string, date: Date | undefined, time: string, duration: number }) => boolean | void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [duration, setDuration] = useState('60');


  const handleSave = () => {
    const success = onAddTask({ title, description, date, time, duration: parseInt(duration, 10) });
    if (success) {
      setTitle('');
      setDescription('');
      setDate(new Date());
      setTime(format(new Date(), 'HH:mm'));
      setDuration('60');
      setIsOpen(false);
    }
  };

  return (
     <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Event</DialogTitle>
            <DialogDescription>
              Schedule a new task, meeting, or appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Event title"
              className="text-base"
            />
            <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add a note or description..."
            />
             <div className="grid grid-cols-2 gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
                <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                />
            </div>
             <div>
              <Label htmlFor="duration">Duration (in minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g., 60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
     </>
  )
}
