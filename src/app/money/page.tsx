'use client';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from 'lucide-react';
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Pie,
  PieChart as RechartsPieChart,
} from 'recharts';

const spendingData = [
  { category: 'Groceries', value: 450, fill: 'var(--color-groceries)' },
  { category: 'Transport', value: 200, fill: 'var(--color-transport)' },
  { category: 'Bills', value: 300, fill: 'var(--color-bills)' },
  { category: 'Entertainment', value: 250, fill: 'var(--color-entertainment)' },
  { category: 'Other', value: 100, fill: 'var(--color-other)' },
];

const chartConfig = {
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

const transactions = [
    {
      id: 1,
      description: 'Monthly Salary',
      category: 'Income',
      amount: 4500,
      date: '2024-07-01',
    },
    {
      id: 2,
      description: 'Grocery Store',
      category: 'Groceries',
      amount: -78.5,
      date: '2024-07-22',
    },
    {
      id: 3,
      description: 'Train Ticket',
      category: 'Transport',
      amount: -22,
      date: '2024-07-22',
    },
    {
      id: 4,
      description: 'Electricity Bill',
      category: 'Bills',
      amount: -112.3,
      date: '2024-07-21',
    },
    {
      id: 5,
      description: 'Movie Tickets',
      category: 'Entertainment',
      amount: -30,
      date: '2024-07-20',
    },
    {
      id: 6,
      description: 'Coffee Shop',
      category: 'Other',
      amount: -5.75,
      date: '2024-07-19',
    },
];

export default function MoneyManagementPage() {
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
  const netSavings = totalIncome + totalExpenses;

  return (
    <>
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Money Management</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-10 bg-muted/20">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total for this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">${Math.abs(totalExpenses).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total for this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${netSavings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Income minus expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,000</div>
              <p className="text-xs text-muted-foreground">Yearly target</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
           <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>A list of your recent financial activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="hidden md:table-cell">{new Date(t.date).toLocaleDateString()}</TableCell>
                       <TableCell className="md:hidden">{new Date(t.date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell className={`text-right font-medium ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {t.amount > 0 ? `+$${t.amount.toFixed(2)}` : `-$${Math.abs(t.amount).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Spending Breakdown</CardTitle>
              <CardDescription>
                A look at where your money is going this month.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-[300px]"
              >
                <RechartsPieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie data={spendingData} dataKey="value" nameKey="category" innerRadius={60} />
                </RechartsPieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
