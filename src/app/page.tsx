"use client";

import { useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Task } from '@/types';
import TaskList from '@/components/task-list';
import ProductivityTips from '@/components/productivity-tips';
import DailyQuote from '@/components/daily-quote';
import Logo from '@/components/logo';

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const uncompletedTasks = useMemo(
    () => tasks.filter(task => !task.completed),
    [tasks]
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Zenith Productivity
          </h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="lg:col-span-3 md:col-span-2">
            <TaskList tasks={tasks} setTasks={setTasks} />
          </div>
          <div className="flex flex-col gap-4">
            <ProductivityTips tasks={uncompletedTasks} />
            <DailyQuote />
          </div>
        </div>
      </main>
    </div>
  );
}
