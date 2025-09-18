"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { generateProductivityTips } from '@/ai/flows/generate-productivity-tips';
import { useToast } from '@/hooks/use-toast';
import { type Task } from '@/types';

type ProductivityTipsProps = {
  tasks: Task[];
};

export default function ProductivityTips({ tasks }: ProductivityTipsProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (tasks.length === 0) {
      setTips([]);
      return;
    }

    startTransition(async () => {
      try {
        const taskString = tasks.map(t => t.text).join(', ');
        const response = await generateProductivityTips({ tasks: taskString });
        const parsedTips = response.tips
          .split('\n')
          .map(tip => tip.trim().replace(/^(\*|-)\s*/, ''))
          .filter(tip => tip.length > 0);
        setTips(parsedTips);
      } catch (error) {
        console.error('Failed to generate productivity tips:', error);
        toast({
          variant: 'destructive',
          title: 'AI Error',
          description: 'Could not generate productivity tips at this time.',
        });
        setTips([]);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Productivity Tips</CardTitle>
        <Sparkles className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="mt-4">
          {isPending ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Add some tasks to get personalized tips!
            </p>
          ) : tips.length > 0 ? (
            <ul className="space-y-2 text-sm list-disc pl-4 text-foreground">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No tips available right now.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
