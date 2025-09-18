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
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
  {
    id: '4',
    title: 'Start a business',
    description: 'Launch a small online store.',
    imageUrl: 'https://picsum.photos/seed/business/600/400',
    imageHint: 'small business',
    completed: false,
  },
  {
    id: '5',
    title: 'Learn to play Guitar',
    description: 'Master the basics of acoustic guitar.',
    imageUrl: 'https://picsum.photos/seed/guitar/600/400',
    imageHint: 'acoustic guitar',
    completed: false,
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

  const currentYear = new Date().getFullYear();
  const middleIndex = Math.floor(visions.length / 2);

  if (!isClient) {
    return null;
  }

  const visionsWithCenterpiece = [...visions];
  // A bit of a hack to insert a "centerpiece" in the middle of the visions
  const centerpiece = (
      <div
        key="centerpiece"
        className={cn(
            'inline-block break-inside-avoid-column p-4 bg-amber-50 rounded-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 border-dashed border-amber-200'
        )}
        style={{ transform: `rotate(1deg)`}}
      >
        <div className="flex flex-col items-center justify-center h-full p-4">
            <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-md">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>YOU</AvatarFallback>
            </Avatar>
             <h2 
              className="text-5xl font-bold text-zinc-800"
              style={{fontFamily: "'Courier New', Courier, monospace"}}
            >
                {currentYear}
            </h2>
            <p className="text-zinc-600 mt-2" style={{fontFamily: "'Courier New', Courier, monospace"}}>My Year of...</p>
        </div>
      </div>
  );
  visionsWithCenterpiece.splice(middleIndex, 0, centerpiece as any);


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
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
              Add to Board
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
        <div className="mb-12 text-center">
            <h1 
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground inline-block px-8 py-2 bg-amber-100/80 "
              style={{fontFamily: "'Courier New', Courier, monospace", transform: 'rotate(-2deg)'}}
            >
                My Vision Board
            </h1>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {visionsWithCenterpiece.map((item: any, index) => {
             if (item.props?.vision) {
                return (
                     <VisionCard
                        key={item.props.vision.id}
                        vision={item.props.vision}
                        onToggle={handleToggleVision}
                        rotation={(index % 5) - 2.5}
                     />
                )
             }
             if (item.key === 'centerpiece') {
                 return item;
             }
             const vision = item as Vision;
             return (
                 <VisionCard
                    key={vision.id}
                    vision={vision}
                    onToggle={handleToggleVision}
                    rotation={(index % 5) - 2.5}
                 />
             )
          })}
        </div>
      </main>
    </div>
  );
}
