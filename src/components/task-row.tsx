'use client';

import { type Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday } from 'date-fns';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskRow({ task, onToggle, onDelete }: TaskRowProps) {
  return (
    <div
      className={cn(
        'group flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50',
        task.completed && 'opacity-70'
      )}
    >
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label="Toggle task completion"
        className="mt-1"
      />
      <div className="flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'cursor-pointer font-medium',
            task.completed && 'text-muted-foreground line-through'
          )}
        >
          {task.text}
        </label>
        {task.description && (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              task.completed && 'line-through'
            )}
          >
            {task.description}
          </p>
        )}
        {task.date && (
           <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(task.date), 'MMM d, p')}
                {task.duration && ` (${task.duration} min)`}
            </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0"
        aria-label="Delete task"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
