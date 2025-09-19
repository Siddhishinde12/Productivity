'use client';

import { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  Calendar as CalendarIcon,
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
import { Pie, PieChart as RechartsPieChart } from 'recharts';
import { type Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const defaultTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Monthly Salary',
    category: 'Income',
    amount: 4500,
    date: '2024-07-01',
    type: 'income',
  },
  {
    id: '2',
    description: 'Grocery Store',
    category: 'Groceries',
    amount: -78.5,
    date: '2024-07-22',
    type: 'expense',
  },
  {
    id: '3',
    description: 'Train Ticket',
    category: 'Transport',
    amount: -22,
    date: '2024-07-22',
    type: 'expense',
  },
  {
    id: '4',
    description: 'Electricity Bill',
    category: 'Bills',
    amount: -112.3,
    date: '2024-07-21',
    type: 'expense',
  },
  {
    id: '5',
    description: 'Movie Tickets',
    category: 'Entertainment',
    amount: -30,
    date: '2024-07-20',
    type: 'expense',
  },
  {
    id: '6',
    description: 'Coffee Shop',
    category: 'Other',
    amount: -5.75,
    date: '2024-07-19',
    type: 'expense',
  },
];

const expenseCategories = ['Groceries', 'Transport', 'Bills', 'Entertainment', 'Health', 'Shopping', 'Other'];

export default function MoneyManagementPage() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'transactions',
    []
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (transactions.length === 0) {
      setTransactions(defaultTransactions);
    }
  }, []);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const totalIncome = useMemo(() => 
    transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(() =>
    transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const netSavings = totalIncome + totalExpenses;

  const spendingData = useMemo(() => {
    const spendingMap = new Map<string, number>();
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const currentTotal = spendingMap.get(t.category) || 0;
        spendingMap.set(t.category, currentTotal + Math.abs(t.amount));
      });
    return Array.from(spendingMap.entries()).map(([category, value], index) => ({
      category,
      value,
      fill: `var(--color-${category.toLowerCase()})`,
    }));
  }, [transactions]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    spendingData.forEach(item => {
      config[item.category.toLowerCase()] = {
        label: item.category,
        color: `hsl(var(--chart-${Object.keys(config).length + 1}))`,
      };
    });
    return config;
  }, [spendingData]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transactionWithId: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transactionWithId, ...prev]);
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b bg-background px-4 md:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Money Management</h1>
        <AddTransactionDialog onAddTransaction={handleAddTransaction} />
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
                  {sortedTransactions.map(t => (
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

function AddTransactionDialog({ onAddTransaction }: { onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const handleSave = () => {
    const numericAmount = parseFloat(amount);
    if (!description || isNaN(numericAmount) || !date) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'Please fill out all fields correctly.',
      });
      return;
    }
    
    if (type === 'expense' && !category) {
        toast({
            variant: 'destructive',
            title: 'Invalid Input',
            description: 'Please select a category for the expense.',
        });
        return;
    }

    const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount);
    const finalCategory = type === 'income' ? 'Income' : category;

    onAddTransaction({
      description,
      amount: finalAmount,
      type,
      category: finalCategory,
      date: date.toISOString(),
    });

    // Reset form and close dialog
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
    setDate(new Date());
    setIsOpen(false);
    toast({
        title: 'Transaction Added',
        description: 'Your transaction has been successfully recorded.'
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (e.g., Groceries, Salary)"
          />
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
          />
          <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
          {type === 'expense' && (
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Add Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
