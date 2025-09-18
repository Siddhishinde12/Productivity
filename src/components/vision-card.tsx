'use client';

import Image from 'next/image';
import { type Vision } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface VisionCardProps {
  vision: Vision;
  onToggle: (id: string) => void;
}

export default function VisionCard({ vision, onToggle }: VisionCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        vision.completed && 'bg-card/60'
      )}
    >
      <div className="relative h-48 w-full">
        <Image
          src={vision.imageUrl}
          alt={vision.title}
          data-ai-hint={vision.imageHint}
          fill
          className="object-cover"
        />
        {vision.completed && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-2xl font-bold text-white">ACHIEVED</p>
            </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{vision.title}</span>
          {vision.completed && <Badge variant="secondary">Completed</Badge>}
        </CardTitle>
        <CardDescription
          className={cn(vision.completed && 'line-through')}
        >
          {vision.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`vision-${vision.id}`}
            checked={vision.completed}
            onCheckedChange={() => onToggle(vision.id)}
          />
          <label
            htmlFor={`vision-${vision.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mark as Completed
          </label>
        </div>
      </CardFooter>
    </Card>
  );
}
