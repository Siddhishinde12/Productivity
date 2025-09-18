'use client';

import Image from 'next/image';
import { type Vision } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface VisionCardProps {
  vision: Vision;
  onToggle: (id: string) => void;
  rotation?: number;
}

export default function VisionCard({ vision, onToggle, rotation = 0 }: VisionCardProps) {
  return (
    <div
      className={cn(
        'inline-block break-inside-avoid-column p-4 bg-white rounded-sm shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105',
        vision.completed && 'opacity-60'
      )}
      style={{ transform: `rotate(${rotation}deg)`}}
    >
      <div className="relative w-full">
        <Image
          src={vision.imageUrl}
          alt={vision.title}
          data-ai-hint={vision.imageHint}
          width={400}
          height={300}
          className="object-cover w-full"
        />
        {vision.completed && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <p 
                  className="text-3xl font-bold text-white uppercase tracking-widest"
                  style={{fontFamily: "'Courier New', Courier, monospace", transform: 'rotate(-5deg)'}}
                >
                  Achieved
                </p>
            </div>
        )}
      </div>
      <div className="p-4">
        <h3 
            className={cn(
                "font-bold text-xl mb-2 text-zinc-800",
                 vision.completed && 'line-through'
            )}
             style={{fontFamily: "'Courier New', Courier, monospace"}}
        >
            {vision.title}
        </h3>
        <p className={cn("text-zinc-600 text-sm", vision.completed && 'line-through')}>
          {vision.description}
        </p>
      </div>
      <div className="px-4 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`vision-${vision.id}`}
            checked={vision.completed}
            onCheckedChange={() => onToggle(vision.id)}
          />
          <label
            htmlFor={`vision-${vision.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-700"
          >
            Mark as Completed
          </label>
        </div>
      </div>
    </div>
  );
}
