'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type TravelPlan } from '@/types';
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
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const defaultTravelPlans: TravelPlan[] = [
  {
    id: '1',
    destination: 'Kyoto, Japan',
    description: 'Experience the cherry blossoms and ancient temples.',
    imageUrl: 'https://picsum.photos/seed/kyoto/600/400',
    imageHint: 'Kyoto cherry blossom',
    status: 'bucket-list',
  },
  {
    id: '2',
    destination: 'Santorini, Greece',
    description: 'Watch the sunset over the Aegean Sea.',
    imageUrl: 'https://picsum.photos/seed/greece/600/400',
    imageHint: 'Santorini sunset',
    status: 'planned',
    departureDate: '2024-09-15',
  },
  {
    id: '3',
    destination: 'Machu Picchu, Peru',
    description: 'Hike the Inca Trail to the ancient city.',
    imageUrl: 'https://picsum.photos/seed/peru/600/400',
    imageHint: 'Machu Picchu',
    status: 'completed',
  },
];

export default function TravelPage() {
  const [travelPlans, setTravelPlans] = useLocalStorage<TravelPlan[]>('travel-plans', []);
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ destination: '', description: '' });
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && travelPlans.length === 0) {
      setTravelPlans(defaultTravelPlans);
    }
  }, [isClient, travelPlans.length, setTravelPlans]);

  const handleAddNewPlan = () => {
    if (newPlan.destination.trim() === '' || newPlan.description.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Destination and description cannot be empty.',
      });
      return;
    }
    const newId = Date.now().toString();
    const newPlanItem: TravelPlan = {
      id: newId,
      ...newPlan,
      imageUrl: `https://picsum.photos/seed/${newId}/600/400`,
      imageHint: newPlan.destination.toLowerCase().split(' ').slice(0, 2).join(' '),
      status: 'bucket-list',
    };
    setTravelPlans([newPlanItem, ...travelPlans]);
    setNewPlan({ destination: '', description: '' });
    setIsNewPlanDialogOpen(false);
    toast({
      title: 'New Adventure!',
      description: 'Your travel plan has been added.',
    });
  };

  const updateStatus = (id: string, status: TravelPlan['status']) => {
    setTravelPlans(plans => plans.map(p => (p.id === id ? { ...p, status } : p)));
  };

  if (!isClient) {
    return null;
  }

  const getStatusBadgeVariant = (status: TravelPlan['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'planned':
        return 'secondary';
      case 'bucket-list':
        return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4 md:px-6">
        <Link href="/">
          <h1 className="text-2xl font-semibold text-foreground">Zenith</h1>
        </Link>
        <Dialog open={isNewPlanDialogOpen} onOpenChange={setIsNewPlanDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Travel Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Travel Plan</DialogTitle>
              <DialogDescription>Where is your next adventure?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                id="destination"
                value={newPlan.destination}
                onChange={e => setNewPlan({ ...newPlan, destination: e.target.value })}
                placeholder="Destination (e.g., Paris, France)"
              />
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Describe your travel plans..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewPlan}>Add Plan</Button>
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
                My Travel Plans
            </h1>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {travelPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                'inline-block break-inside-avoid-column p-2 bg-white rounded-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105',
                plan.status === 'completed' && 'opacity-60'
              )}
              style={{ transform: `rotate(${(index % 5) - 2.5}deg)` }}
            >
              <div className="relative w-full">
                <Image
                  src={plan.imageUrl}
                  alt={plan.destination}
                  data-ai-hint={plan.imageHint}
                  width={300}
                  height={225}
                  className="object-cover w-full"
                />
                 {plan.status === 'completed' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <p 
                          className="text-2xl font-bold text-white uppercase tracking-widest"
                          style={{fontFamily: "'Courier New', Courier, monospace", transform: 'rotate(-5deg)'}}
                        >
                          Visited
                        </p>
                    </div>
                )}
              </div>
              <div className="p-3">
                 <h3 
                    className={cn(
                        "font-bold text-base mb-1 text-zinc-800",
                         plan.status === 'completed' && 'line-through'
                    )}
                     style={{fontFamily: "'Courier New', Courier, monospace"}}
                >
                    {plan.destination}
                </h3>
                <p className={cn("text-zinc-600 text-xs", plan.status === 'completed' && 'line-through')}>
                  {plan.description}
                </p>
                 {plan.status === 'planned' && plan.departureDate && (
                    <p className="text-xs text-zinc-500 mt-2">
                        Departure: {new Date(plan.departureDate).toLocaleDateString()}
                    </p>
                )}
              </div>
               <div className="px-3 pb-2">
                <Select value={plan.status} onValueChange={(value: TravelPlan['status']) => updateStatus(plan.id, value)}>
                    <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bucket-list">Bucket List</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
