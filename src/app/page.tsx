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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { QUOTES } from '@/lib/quotes';
import TaskList from '@/components/task-list';
import { Plus } from 'lucide-react';

export default function Home() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>(
    'active-list-id',
    null
  );
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(
    null
  );
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  useEffect(() => {
    if (lists.length === 0) {
      const defaultList: TodoListType = {
        id: Date.now().toString(),
        name: 'My Tasks',
        tasks: [
          { id: '1', text: 'Finish report for Q2', completed: false, date: new Date().toISOString() },
          { id: '2', text: 'Schedule a dentist appointment', completed: true, date: new Date().toISOString() },
          { id: '3', text: 'Pick up groceries', completed: false, date: new Date().toISOString() },
        ],
      };
      setLists([defaultList]);
      setActiveListId(defaultList.id);
    } else if (!activeListId || !lists.some(l => l.id === activeListId)) {
      setActiveListId(lists[0]?.id || null);
    }
  }, [lists, setLists, activeListId, setActiveListId]);

  const activeList = useMemo(
    () => lists.find(list => list.id === activeListId),
    [lists, activeListId]
  );
  
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return activeList?.tasks
      .filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        return taskDate >= today && taskDate < tomorrow;
      })
      .sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || new Date(a.date!).getTime() - new Date(b.date!).getTime());
  }, [activeList]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    return activeList?.tasks
      .filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        return taskDate >= tomorrow;
      })
      .sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || new Date(a.date!).getTime() - new Date(b.date!).getTime());
  }, [activeList]);


  const handleAddTask = (taskText: string) => {
    if (!activeListId) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      date: new Date().toISOString(),
    };
    const updatedLists = lists.map(list =>
      list.id === activeListId
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    );
    setLists(updatedLists);
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

  const handleAddNewList = () => {
    if (newListName.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'List name cannot be empty.',
      });
      return;
    }
    const newList: TodoListType = {
      id: Date.now().toString(),
      name: newListName.trim(),
      tasks: [],
    };
    setLists([...lists, newList]);
    setActiveListId(newList.id);
    setNewListName('');
    setIsNewListDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-[60px] items-center gap-4 border-b bg-background px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Zenith
        </h1>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto w-full max-w-4xl">
          {quote && (
            <div className="mb-8 rounded-lg bg-card p-6 text-center">
              <blockquote className="text-xl italic">
                "{quote.quote}"
              </blockquote>
              <cite className="mt-4 block text-right font-semibold">
                - {quote.author}
              </cite>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Todo Lists</h2>
              <Button onClick={() => setIsNewListDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New List
              </Button>
            </div>
            {isClient && (
              <div className="mt-4 flex flex-wrap gap-2">
                {lists.map(list => (
                  <Button
                    key={list.id}
                    variant={activeListId === list.id ? 'default' : 'outline'}
                    onClick={() => setActiveListId(list.id)}
                  >
                    {list.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {isClient && activeList ? (
            <div className='space-y-8'>
              <TaskList
                title="Today's Tasks"
                tasks={todayTasks || []}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
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
             <div className="text-center text-muted-foreground">
              <p>Select a list or create a new one to get started.</p>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new list</DialogTitle>
            <DialogDescription>
              Give your new list a name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              placeholder="e.g. Work, Personal"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewList()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewList}>Create List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
