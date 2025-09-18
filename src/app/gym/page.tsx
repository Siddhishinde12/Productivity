'use client';

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { type Workout } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dumbbell, Target, Flame, HeartPulse, Plus } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const defaultWorkouts: Workout[] = [
  { id: '1', date: '2024-07-22', type: 'Weightlifting', duration: 60 },
  { id: '2', date: '2024-07-20', type: 'Cardio', duration: 30 },
  { id: '3', date: '2024-07-18', type: 'Weightlifting', duration: 75 },
];

const weightData = [
    { date: '2024-07-01', weight: 180 },
    { date: '2024-07-08', weight: 178 },
    { date: '2024-07-15', weight: 177 },
    { date: '2024-07-22', weight: 176 },
]

export default function GymPage() {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(
    'workouts',
    []
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (workouts.length === 0) {
        setWorkouts(defaultWorkouts);
    }
  }, []);

  const workoutsThisWeek = isClient
    ? workouts.filter(w => {
        const workoutDate = new Date(w.date);
        const today = new Date();
        const firstDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        return workoutDate >= firstDayOfWeek;
      }).length
    : 0;

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Gym & Health</h1>
        <Button>
          <Plus className="mr-2" /> Log Workout
        </Button>
      </header>
      <main className="flex-1 p-4 md:p-10 overflow-auto">
        <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
                Your Fitness Journey
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Track your fitness journey, crush your goals, and build a stronger you.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workoutsThisWeek} / 5</div>
                <p className="text-xs text-muted-foreground">Workouts completed this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Challenge</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75 Hard</div>
                <p className="text-xs text-muted-foreground">Day 12</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
                <HeartPulse className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">176 lbs</div>
                <p className="text-xs text-muted-foreground">-4 lbs this month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Personal Best</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">225 lbs</div>
                <p className="text-xs text-muted-foreground">Bench Press</p>
              </CardContent>
            </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Workout History</CardTitle>
                    <CardDescription>Your most recent workouts.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Duration</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workouts.slice(0, 5).map(workout => (
                                <TableRow key={workout.id}>
                                    <TableCell>{format(new Date(workout.date), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>{workout.type}</TableCell>
                                    <TableCell className="text-right">{workout.duration} min</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Weight Progress</CardTitle>
                    <CardDescription>Your weight tracking over the last month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={weightData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(str) => format(new Date(str), 'MMM d')} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
