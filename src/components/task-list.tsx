'use client';

import { type Task } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TaskCard from './task-card';


interface TaskListProps {
  title: string;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  showInput?: boolean;
}

export default function TaskList({
  title,
  tasks,
  onToggleTask,
  onDeleteTask,
}: TaskListProps) {
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <Card className="h-full flex flex-col bg-transparent shadow-none border-none">
      <CardHeader className="px-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        {tasks.length === 0 && (
           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-12 text-center h-full">
            <h3 className="text-lg font-semibold tracking-tight">All clear!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No tasks for this section.
            </p>
          </div>
        )}
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

        {completedTasks.length > 0 && (
          <div className="mt-6">
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