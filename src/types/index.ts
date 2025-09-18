export type Task = {
  id: string;
  text: string;
  completed: boolean;
  date?: string;
  duration?: number; // in minutes
  color?: string;
};

export type Quote = {
  quote: string;
  author: string;
};

export type TodoList = {
  id:string;
  name: string;
  tasks: Task[];
};

    