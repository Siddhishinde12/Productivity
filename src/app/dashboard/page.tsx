'use client';

import {
  BarChart,
  Briefcase,
  Dumbbell,
  DollarSign,
  PiggyBank,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { QUOTES } from '@/lib/quotes';

const monthlyData = [
  { month: 'Jan', saved: 186, spent: 80 },
  { month: 'Feb', saved: 305, spent: 200 },
  { month: 'Mar', saved: 237, spent: 120 },
  { month: 'Apr', saved: 173, spent: 190 },
  { month: 'May', saved: 209, spent: 130 },
  { month: 'Jun', saved: 214, spent: 140 },
];

const spendingData = [
  { category: 'Groceries', value: 450, fill: 'var(--color-groceries)' },
  { category: 'Transport', value: 200, fill: 'var(--color-transport)' },
  { category: 'Bills', value: 300, fill: 'var(--color-bills)' },
  { category: 'Entertainment', value: 250, fill: 'var(--color-entertainment)' },
  { category: 'Other', value: 100, fill: 'var(--color-other)' },
];

const chartConfig = {
  saved: {
    label: 'Saved',
    color: 'hsl(var(--chart-2))',
  },
  spent: {
    label: 'Spent',
    color: 'hsl(var(--chart-5))',
  },
  groceries: {
    label: 'Groceries',
    color: 'hsl(var(--chart-1))',
  },
  transport: {
    label: 'Transport',
    color: 'hsl(var(--chart-2))',
  },
  bills: {
    label: 'Bills',
    color: 'hsl(var(--chart-3))',
  },
  entertainment: {
    label: 'Entertainment',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
};

export default function DashboardPage() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);


  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
        {isClient && quote && (
            <div className="mb-4 rounded-lg bg-card p-6 text-center shadow-sm">
              <blockquote className="text-xl italic">
                "{quote.quote}"
              </blockquote>
              <cite className="mt-4 block text-right font-semibold">
                - {quote.author}
              </cite>
            </div>
          )}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Target
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,000</div>
              <p className="text-xs text-muted-foreground">
                +75% to completion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,329</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Spent</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$840</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Yearly Target
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$120,000</div>
              <p className="text-xs text-muted-foreground">
                +10% year to date
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projects Completed
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SIP Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,400</div>
              <p className="text-xs text-muted-foreground">
                Total investment value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Losses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-$215</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gym Tracker</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <p className="text-xs text-muted-foreground">
                Workouts this week
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>
                Your spending and saving habits over the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <RechartsBarChart data={monthlyData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="saved" fill="var(--color-saved)" radius={4} />
                  <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
              <CardDescription>
                A look at where your money is going this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[250px]"
              >
                <RechartsPieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie data={spendingData} dataKey="value" nameKey="category" />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Grocery Store</TableCell>
                    <TableCell>Groceries</TableCell>
                    <TableCell className="text-right">-$78.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Train Ticket</TableCell>
                    <TableCell>Transport</TableCell>
                    <TableCell className="text-right">-$22.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Electricity Bill</TableCell>
                    <TableCell>Bills</TableCell>
                    <TableCell className="text-right">-$112.30</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Movie Tickets</TableCell>
                    <TableCell>Entertainment</TableCell>
                    <TableCell className="text-right">-$30.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Coffee Shop</TableCell>
                    <TableCell>Other</TableCell>
                    <TableCell className="text-right">-$5.75</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
  );
}
