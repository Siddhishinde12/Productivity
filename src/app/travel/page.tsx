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
import { Plus, Plane } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


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
    departureDate: '2024-09-15'
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
    })
  };
  
  const updateStatus = (id: string, status: TravelPlan['status']) => {
      setTravelPlans(plans => plans.map(p => p.id === id ? {...p, status} : p));
  }

  if (!isClient) {
    return null;
  }
  
  const getStatusBadgeVariant = (status: TravelPlan['status']) => {
      switch(status) {
          case 'completed': return 'default';
          case 'planned': return 'secondary';
          case 'bucket-list': return 'outline';
      }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
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
              <DialogDescription>
                Where is your next adventure?
              </DialogDescription>
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
        <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                My Travel Plans
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                "The world is a book and those who do not travel read only one page."
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {travelPlans.map(plan => (
             <Card
                key={plan.id}
                className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             >
                <div className="relative h-48 w-full">
                    <Image
                        src={plan.imageUrl}
                        alt={plan.destination}
                        data-ai-hint={plan.imageHint}
                        fill
                        className="object-cover"
                    />
                     <div className="absolute top-2 right-2">
                        <Badge variant={getStatusBadgeVariant(plan.status)}>{plan.status.replace('-', ' ')}</Badge>
                     </div>
                </div>
                <CardHeader>
                    <CardTitle>{plan.destination}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                 <CardContent>
                    {plan.status === 'planned' && plan.departureDate && (
                        <p className="text-sm text-muted-foreground">
                            Departure: {new Date(plan.departureDate).toLocaleDateString()}
                        </p>
                    )}
                </CardContent>
                <CardFooter className="mt-auto">
                    <Select value={plan.status} onValueChange={(value: TravelPlan['status']) => updateStatus(plan.id, value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bucket-list">Bucket List</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
