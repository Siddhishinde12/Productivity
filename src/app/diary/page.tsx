'use client';

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type DiaryEntry, type Mood } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  BookText,
  Smile,
  Meh,
  Frown,
  Angry,
  Bold,
  Italic,
  Underline,
  List,
  Image as ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const defaultEntries: DiaryEntry[] = [
    {id: '1', date: new Date(Date.now() - 86400000).toISOString(), title: 'A stroll in the park', content: 'Took a long walk today, it was refreshing.', mood: 'happy'},
    {id: '2', date: new Date(Date.now() - 172800000).toISOString(), title: 'New project update', content: 'Made great progress on the new feature.', mood: 'happy'},
    {id: '3', date: new Date(Date.now() - 259200000).toISOString(), title: 'Challenging day', content: 'Faced a few hurdles at work, but pushed through.', mood: 'sad'},
];

export default function DiaryPage() {
  const [entries, setEntries] = useLocalStorage<DiaryEntry[]>('diary-entries', []);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (entries.length === 0) {
        setEntries(defaultEntries);
    }
  }, []);

  const recentEntries = useMemo(() => {
    return [...entries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [entries]);

  const handleSaveEntry = () => {
    if (!selectedDate || content.trim() === '') {
        toast({
            variant: 'destructive',
            title: 'Incomplete Entry',
            description: 'Please make sure you have selected a date and written something.'
        });
        return;
    }

    const title = content.split('\n')[0].substring(0, 30) || 'New Entry';

    const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: selectedDate.toISOString(),
        title,
        content,
        mood
    };

    setEntries([newEntry, ...entries]);
    setContent('');
    toast({
        title: 'Entry Saved!',
        description: 'Your diary entry has been saved successfully.'
    });
  };

  const moodIcons = {
    happy: <Smile className="h-8 w-8" />,
    neutral: <Meh className="h-8 w-8" />,
    sad: <Frown className="h-8 w-8" />,
    angry: <Angry className="h-8 w-8" />,
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-8">
        <div className="flex items-center gap-3">
          <BookText className="h-6 w-6 text-foreground" />
          <h1 className="text-2xl font-semibold text-foreground">Diary</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{format(new Date(), "MMMM d, yyyy")}</span>
            <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>OT</AvatarFallback>
            </Avatar>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <div className="p-2 border-b flex items-center gap-2">
                                <Button variant="ghost" size="icon"><Bold /></Button>
                                <Button variant="ghost" size="icon"><Italic /></Button>
                                <Button variant="ghost" size="icon"><Underline /></Button>
                                <Button variant="ghost" size="icon"><List /></Button>
                            </div>
                            <Textarea 
                                placeholder="Write your thoughts..."
                                className="w-full h-64 border-0 rounded-t-none focus-visible:ring-0"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Mood</h3>
                            <div className="flex items-center gap-4">
                                {Object.keys(moodIcons).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMood(m as Mood)}
                                        className={cn(
                                            "p-2 rounded-full transition-colors",
                                            mood === m ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-accent'
                                        )}
                                    >
                                        {moodIcons[m as Mood]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3">Upload</h3>
                             <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-accent">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button size="lg" onClick={handleSaveEntry}>Save Entry</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardContent className="p-2">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="w-full"
                         />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Entries</CardTitle>
                        <CardDescription>A look at your past few entries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentEntries.map(entry => (
                                <div key={entry.id}>
                                    <p className="font-semibold">{entry.title}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(entry.date), 'MMMM d, yyyy')}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
