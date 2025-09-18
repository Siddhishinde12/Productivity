"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { QUOTES } from '@/lib/quotes';
import { type Quote } from '@/types';

export default function DailyQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Daily Motivation</CardTitle>
        <Lightbulb className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {quote ? (
          <div className="mt-4">
            <p className="text-lg font-medium italic">"{quote.quote}"</p>
            <p className="mt-2 text-right text-sm text-muted-foreground">
              - {quote.author}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/2 ml-auto animate-pulse rounded-md bg-muted" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
