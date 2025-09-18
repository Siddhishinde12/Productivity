'use client';

import { useState } from 'react';
import { type Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import TaskCard from './task-card';

interface TaskListProps {
  title: string;
  tasks: Task[];
  onAddTask?: (taskText: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  showInput?: boolean;
}

export default function TaskList({
  title,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  showInput = true,
}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() && onAddTask) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {showInput && onAddTask && (
          <form onSubmit={handleAddTask} className="flex w-full items-center space-x-2 pt-4">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="What do you need to do?"
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-auto">
        {tasks.length === 0 && (
           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-12 text-center">
            <h3 className="text-lg font-semibold tracking-tight">All clear!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a new task to get started.
            </p>
          </div>
        )}
        {uncompletedTasks.length > 0 && (
          <div className="space-y-2">
            {uncompletedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
