"use client";

import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task, type TodoList as TodoListType } from '@/types';
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
import { List, Plus, Search, Settings2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Home() {
  const [lists, setLists] = useLocalStorage<TodoListType[]>('todo-lists', []);
  const [activeListId, setActiveListId] = useLocalStorage<string | null>(
    'active-list-id',
    null
  );
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (lists.length === 0) {
      const defaultList: TodoListType = {
        id: Date.now().toString(),
        name: 'Odama Team',
        tasks: [
          { id: '1', text: 'Moodboarding - Showtime Project', completed: false, date: '2025-04-01T07:30:00', duration: 210, color: 'pink' },
          { id: '2', text: 'Wireframe - Altafluent Project', completed: false, date: '2025-04-02T08:00:00', duration: 120, color: 'blue' },
          { id: '3', text: 'Exploration Design - Odama Shot', completed: false, date: '2025-04-04T07:30:00', duration: 150, color: 'blue' },
          { id: '4', text: 'Feedback - BigLeads Projects', completed: false, date: '2025-04-06T08:00:00', duration: 120, color: 'green' },
          { id: '5', text: 'Feedback - Altafluent Projects', completed: false, date: '2025-04-06T10:00:00', duration: 120, color: 'yellow' },
          { id: '6', text: 'Wireframe - RTGO Projects', completed: false, date: '2025-04-07T11:00:00', duration: 120, color: 'cyan' },
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

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start from Monday
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  }, [currentDate]);

  const timeSlots = Array.from({ length: 8 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

  const colorMap: { [key: string]: string } = {
    pink: 'bg-pink-100 border-pink-300',
    blue: 'bg-blue-100 border-blue-300',
    green: 'bg-green-100 border-green-300',
    yellow: 'bg-yellow-100 border-yellow-300',
    cyan: 'bg-cyan-100 border-cyan-300',
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar>
          <SidebarContent className="p-0">
            <SidebarHeader className="p-4 border-b">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                     <Avatar className="h-8 w-8">
                       <AvatarImage src="https://picsum.photos/seed/1/32/32" />
                       <AvatarFallback>OT</AvatarFallback>
                     </Avatar>
                     <span className="font-semibold text-lg">{activeList?.name}</span>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Your Teams</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   {lists.map(list => (
                     <DropdownMenuItem key={list.id} onClick={() => setActiveListId(list.id)}>
                       {list.name}
                     </DropdownMenuItem>
                   ))}
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => setIsNewListDialogOpen(true)}>
                     <Plus className="mr-2 h-4 w-4" />
                     <span>Create Team</span>
                   </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarHeader>
             <SidebarMenu className="flex-1 p-4 pt-4">
               <p className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Track</p>
               <SidebarMenuItem>
                 <SidebarMenuButton className="justify-start"><Clock className="mr-2"/>Timer</SidebarMenuButton>
               </SidebarMenuItem>
               <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Analyze</p>
               <SidebarMenuItem>
                 <SidebarMenuButton className="justify-start">Report</SidebarMenuButton>
               </SidebarMenuItem>
                 <SidebarMenuItem>
                 <SidebarMenuButton className="justify-start">Insight</SidebarMenuButton>
               </SidebarMenuItem>

               <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Manage</p>
                <SidebarMenuItem>
                 <SidebarMenuButton className="justify-start">Projects</SidebarMenuButton>
               </SidebarMenuItem>
                <SidebarMenuItem>
                 <SidebarMenuButton className="justify-start">Clients</SidebarMenuButton>
               </SidebarMenuItem>
                <SidebarMenuItem>
                 <SidebarMenuButton className="justify-start"><DollarSign className="mr-2"/>Billable rates</SidebarMenuButton>
               </SidebarMenuItem>
             </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <main className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                What have you done?
              </h1>
            </div>
            <div className="flex items-center gap-2">
               <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search tasks..." className="pl-8 sm:w-[200px] md:w-[300px]" />
              </div>
              <Button variant="outline">Customize</Button>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)))}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)))}><ChevronRight className="h-4 w-4" /></Button>
                </div>
                 <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Today
                </Button>
            </div>
            
            <div className="grid grid-cols-[auto,1fr] flex-1">
                <div className="pr-4 border-r">
                    {timeSlots.map(time => (
                        <div key={time} className="h-24 text-right text-sm text-muted-foreground pr-2 pt-1">{time}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {weekDays.map((day, dayIndex) => (
                        <div key={day.toISOString()} className="border-r relative">
                            <div className="text-center py-2 border-b">
                                <p className="text-sm font-medium">{day.getDate()}</p>
                                <p className="text-xs text-muted-foreground">{dayNames[day.getDay()]}</p>
                            </div>
                            <div className="h-full">
                                {activeList?.tasks.filter(task => new Date(task.date as string).toDateString() === day.toDateString())
                                .map(task => {
                                    const taskDate = new Date(task.date as string);
                                    const top = (taskDate.getHours() - 7 + taskDate.getMinutes()/60) * 6; // 6rem per hour (h-24)
                                    const height = (task.duration as number / 60) * 6;
                                    return (
                                        <div key={task.id} 
                                             className={`absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg border text-xs ${colorMap[task.color as string] || 'bg-gray-100'}`}
                                             style={{ top: `${top}rem`, height: `${height}rem` }}>
                                             <p className="font-semibold">{task.text}</p>
                                             <p>{taskDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        </main>
      </div>

      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
            <DialogDescription>
              Give your new team a name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              placeholder="e.g. Design Team, Marketing"
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewList()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewList}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
