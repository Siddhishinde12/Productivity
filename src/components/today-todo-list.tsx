'use client';

import { type Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface TodayTodoListProps {
  tasks: Task[];
}

export default function TodayTodoList({ tasks }: TodayTodoListProps) {
    const uncompletedTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Today's Focus</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
            <div className="space-y-4">
                {tasks.length === 0 && (
                    <div className="text-center text-muted-foreground pt-12">
                        <p>No tasks for today. Enjoy your day!</p>
                    </div>
                )}

                {uncompletedTasks.length > 0 && (
                <div className="space-y-2">
                    {uncompletedTasks.map(task => (
                    <div key={task.id} className="flex items-center space-x-3">
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
                        <div key={task.id} className="flex items-center space-x-3">
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
