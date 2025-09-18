"use client";

import { useState, type Dispatch, type SetStateAction, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { type Task } from '@/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type TaskListProps = {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
};

export default function TaskList({ tasks, setTasks }: TaskListProps) {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
        <form onSubmit={handleAddTask} className="flex w-full items-center space-x-2 pt-4">
          <Input
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="text-base"
          />
          <Button type="submit" size="icon" aria-label="Add task">
            <Plus className="h-5 w-5" />
          </Button>
        </form>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition-all',
                    task.completed ? 'bg-muted/50' : 'bg-card'
                  )}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      'flex-1 cursor-pointer text-sm font-medium transition-colors',
                      task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}
                  >
                    {task.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete task "${task.text}"`}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-12 text-center">
                <h3 className="text-lg font-semibold tracking-tight">You're all caught up!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add a new task to get started.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
