'use client';

import { type Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { PartyPopper } from 'lucide-react';

interface TodayFocusProps {
  tasks: Task[];
  festival?: string;
}

export default function TodayFocus({ tasks, festival }: TodayFocusProps) {
    const uncompletedTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Today's Focus</CardTitle>
        {festival && (
          <CardDescription className="flex items-center gap-2 pt-2 text-purple-600 dark:text-purple-400 font-semibold">
            <PartyPopper className="h-5 w-5" />
            Happy {festival}!
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
                {tasks.length === 0 && (
                    <div className="text-center text-muted-foreground pt-12">
                        <p>No tasks for today. Enjoy your day!</p>
                    </div>
                )}

                {uncompletedTasks.length > 0 && (
                <div className="space-y-2">
                    {uncompletedTasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted">
                        <Checkbox id={`today-task-${task.id}`} checked={task.completed} />
                        <label
                        htmlFor={`today-task-${task.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                        {task.text}
                        </label>
                    </div>
                    ))}
                </div>
                )}

                {completedTasks.length > 0 && (
                <div>
                    <h3 className="mb-2 mt-4 text-sm font-medium text-muted-foreground">
                    Completed ({completedTasks.length})
                    </h3>
                    <div className="space-y-2">
                    {completedTasks.map(task => (
                        <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg">
                        <Checkbox id={`today-task-${task.id}`} checked={task.completed} />
                        <label
                            htmlFor={`today-task-${task.id}`}
                            className={cn(
                            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                            'text-muted-foreground line-through'
                            )}
                        >
                            {task.text}
                        </label>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
