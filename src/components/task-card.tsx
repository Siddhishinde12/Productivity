'use client';

import { type Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <Card className="group">
      <CardContent className="flex items-center gap-4 p-3">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          aria-label="Toggle task completion"
        />
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'flex-1 cursor-pointer text-sm font-medium',
            task.completed && 'text-muted-foreground line-through'
          )}
        >
          {task.text}
        </label>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
