'use client';

import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task, type TodoList as TodoListType } from '@/types';
import { Button } from '@/components/ui/button';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import TaskList from '@/components/task-list';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { isToday, isFuture, format } from 'date-fns';
import { cn } from '@/lib/utils';
import TaskCard from '@/components/task-card';


export default function TasksPage() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>(
    'active-list-id',
    null
  );
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (lists.length === 0) {
        const defaultList: TodoListType = {
          id: 'default-list',
          name: 'My Tasks',
          tasks: [
            { id: '1', text: 'Finish report for Q2', description: 'Complete the quarterly financial report.', completed: false, date: new Date().toISOString() },
            { id: '2', text: 'Schedule dentist appointment', description: 'Call Dr. Smith\'s office.', completed: true, date: new Date().toISOString() },
            { id: '3', text: 'Pick up groceries', description: 'Milk, bread, eggs.', completed: false, date: new Date().toISOString() },
          ],
        };
        setLists([defaultList]);
        setActiveListId(defaultList.id);
      } else if (!activeListId || !lists.some(l => l.id === activeListId)) {
        setActiveListId(lists[0]?.id || null);
      }
    }
  }, [isClient, lists, setLists, activeListId, setActiveListId]);

  const activeList = useMemo(
    () => lists.find(list => list.id === activeListId),
    [lists, activeListId]
  );
  
  const todayTasks = useMemo(() => {
    if (!activeList) return [];
    return activeList.tasks
      .filter(task => task.date && isToday(new Date(task.date)))
      .sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || new Date(a.date!).getTime() - new Date(b.date!).getTime());
  }, [activeList]);

  const upcomingTasks = useMemo(() => {
    if (!activeList) return [];
    return activeList.tasks
      .filter(task => task.date && isFuture(new Date(task.date)) && !isToday(new Date(task.date)))
       .sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || new Date(a.date!).getTime() - new Date(b.date!).getTime());
  }, [activeList]);


  const handleAddTask = (taskDetails: { title: string, description: string, date: Date | undefined }) => {
    if (!activeListId) return;
     if (!taskDetails.title) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Task title cannot be empty.',
        });
        return;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskDetails.title,
      description: taskDetails.description,
      completed: false,
      date: taskDetails.date ? taskDetails.date.toISOString() : new Date().toISOString(),
    };
    const updatedLists = lists.map(list =>
      list.id === activeListId
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );
    setLists(updatedLists);
    return true;
  };

  const handleToggleTask = (taskId: string) => {
    if (!activeListId) return;
    const updatedLists = lists.map(list =>
      list.id === activeListId
        ? {
            ...list,
            tasks: list.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          }
        : list
    );
    setLists(updatedLists);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!activeListId) return;
    const updatedLists = lists.map(list =>
      list.id === activeListId
        ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
        : list
    );
    setLists(updatedLists);
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          My Tasks
        </h1>
        <AddTaskDialog onAddTask={handleAddTask} />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 overflow-auto">
        <div className="mx-auto w-full max-w-4xl">
          {isClient && activeList ? (
            <div className='space-y-8'>
              <TaskList
                title="Today's Tasks"
                tasks={todayTasks || []}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                showInput={false}
              />
              <TaskList
                title="Upcoming"
                tasks={upcomingTasks || []}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                showInput={false}
              />
            </div>
          ) : (
             isClient && <div className="text-center text-muted-foreground">
              <p>Loading tasks...</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function AddTaskDialog({ onAddTask }: { onAddTask: (details: { title: string, description: string, date: Date | undefined }) => boolean | void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSave = () => {
    const success = onAddTask({ title, description, date });
    if (success) {
      setTitle('');
      setDescription('');
      setDate(new Date());
      setIsOpen(false);
    }
  };

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new task</DialogTitle>
            <DialogDescription>
              What do you need to get done?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
            />
            <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Add a note or description..."
            />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
