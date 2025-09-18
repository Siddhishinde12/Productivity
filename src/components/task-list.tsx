'use client';

import { useState } from 'react';
import { type TodoList } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import TaskCard from './task-card';

interface TaskListProps {
  list: TodoList;
  onAddTask: (taskText: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function TaskList({
  list,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
    }
  };

  const uncompletedTasks = list.tasks.filter(t => !t.completed);
  const completedTasks = list.tasks.filter(t => t.completed);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
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
      </CardHeader>
      <CardContent className="flex-1 space-y-4 overflow-auto">
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

        {list.tasks.length === 0 && (
           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-12 text-center">
            <h3 className="text-lg font-semibold tracking-tight">All clear!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a new task to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
