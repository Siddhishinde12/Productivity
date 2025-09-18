'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Vision } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import VisionCard from '@/components/vision-card';
import Link from 'next/link';

const defaultVisions: Vision[] = [
  {
    id: '1',
    title: 'Run a Marathon',
    description: 'Train for and complete a full 26.2-mile marathon.',
    imageUrl: 'https://picsum.photos/seed/running/600/400',
    imageHint: 'running marathon',
    completed: false,
  },
  {
    id: '2',
    title: 'Learn Spanish',
    description: 'Achieve conversational fluency in Spanish.',
    imageUrl: 'https://picsum.photos/seed/spain/600/400',
    imageHint: 'spain language',
    completed: false,
  },
  {
    id: '3',
    title: 'Travel to Japan',
    description: 'Explore the culture and beauty of Japan for two weeks.',
    imageUrl: 'https://picsum.photos/seed/japan/600/400',
    imageHint: 'japan travel',
    completed: true,
  },
];

export default function VisionBoardPage() {
  const [visions, setVisions] = useLocalStorage<Vision[]>('visions', []);
  const [isNewVisionDialogOpen, setIsNewVisionDialogOpen] = useState(false);
  const [newVision, setNewVision] = useState({ title: '', description: '' });
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && visions.length === 0) {
      setVisions(defaultVisions);
    }
  }, [isClient, visions.length, setVisions]);

  const handleToggleVision = (id: string) => {
    setVisions(
      visions.map(v => (v.id === id ? { ...v, completed: !v.completed } : v))
    );
  };

  const handleAddNewVision = () => {
    if (
      newVision.title.trim() === '' ||
      newVision.description.trim() === ''
    ) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Title and description cannot be empty.',
      });
      return;
    }
    const newId = Date.now().toString();
    const newVisionItem: Vision = {
      id: newId,
      ...newVision,
      imageUrl: `https://picsum.photos/seed/${newId}/600/400`,
      imageHint: newVision.title.toLowerCase().split(' ').slice(0, 2).join(' '),
      completed: false,
    };
    setVisions([newVisionItem, ...visions]);
    setNewVision({ title: '', description: '' });
    setIsNewVisionDialogOpen(false);
    toast({
        title: 'Success!',
        description: 'Your new vision has been added to the board.',
    })
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4 md:px-6">
        <Link href="/">
          <h1 className="text-2xl font-semibold text-foreground">Zenith</h1>
        </Link>
        <Dialog
          open={isNewVisionDialogOpen}
          onOpenChange={setIsNewVisionDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Vision
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Vision</DialogTitle>
              <DialogDescription>
                What new goal are you setting for yourself?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="title"
                value={newVision.title}
                onChange={e =>
                  setNewVision({ ...newVision, title: e.target.value })
                }
                placeholder="Vision Title (e.g., Learn to Code)"
              />
              <Textarea
                id="description"
                value={newVision.description}
                onChange={e =>
                  setNewVision({ ...newVision, description: e.target.value })
                }
                placeholder="Describe your vision in a few words..."
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewVisionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNewVision}>Add Vision</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 p-4 md:p-10">
        <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                My Vision Board
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it."
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visions.map(vision => (
            <VisionCard
              key={vision.id}
              vision={vision}
              onToggle={handleToggleVision}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
