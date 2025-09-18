"use client";

import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task, type TodoList as TodoListType } from '@/types';
import TaskList from '@/components/task-list';
import ProductivityTips from '@/components/productivity-tips';
import DailyQuote from '@/components/daily-quote';
import Logo from '@/components/logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { List, Plus } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>(
    'active-list-id',
    null
  );
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (lists.length === 0) {
      const defaultList: TodoListType = {
        id: Date.now().toString(),
        name: 'My Tasks',
        tasks: [],
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

  const uncompletedTasks = useMemo(
    () => activeList?.tasks.filter(task => !task.completed) || [],
    [activeList]
  );

  const handleSetTasks = (tasks: Task[]) => {
    if (!activeListId) return;
    const newLists = lists.map(list =>
      list.id === activeListId ? { ...list, tasks } : list
    );
    setLists(newLists);
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Sidebar>
          <SidebarContent className="p-0">
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Zenith
                </h1>
              </div>
            </SidebarHeader>
            <SidebarMenu className="p-4 pt-0">
              <SidebarMenuItem>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsNewListDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New List
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu className="flex-1 p-4 pt-0">
              <p className="mb-2 text-sm font-semibold text-muted-foreground">
                Your Lists
              </p>
              {lists.map(list => (
                <SidebarMenuItem key={list.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveListId(list.id)}
                    isActive={list.id === activeListId}
                    className="justify-start"
                  >
                    <List className="h-4 w-4" />
                    {list.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            {activeList?.name || 'Zenith Productivity'}
          </h1>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="lg:col-span-3 md:col-span-2">
              {activeList ? (
                <TaskList
                  key={activeList.id}
                  tasks={activeList.tasks}
                  setTasks={handleSetTasks}
                />
              ) : (
                 <Card>
                  <CardContent className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-12 text-center">
                    <h3 className="text-lg font-semibold tracking-tight">No list selected</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create or select a list to get started.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <ProductivityTips tasks={uncompletedTasks} />
              <DailyQuote />
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new list</DialogTitle>
            <DialogDescription>
              Give your new to-do list a name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              placeholder="e.g. Work, Groceries, etc."
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewList()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewList}>Create List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
