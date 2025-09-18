'use client';

import { type Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <Card className="group">
      <CardContent className="flex items-start gap-4 p-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          aria-label="Toggle task completion"
          className='mt-1'
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
                 <p className={cn(
                    'text-sm text-muted-foreground',
                     task.completed && 'line-through'
                    )}>
                    {task.description}
                </p>
            )}
            {task.date && (
                <p className="text-xs text-muted-foreground mt-1">
                    {isToday(new Date(task.date)) 
                      ? format(new Date(task.date), 'p') 
                      : format(new Date(task.date), 'MMM d, yyyy, p')}
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
      </CardContent>
    </Card>
  );
}

    