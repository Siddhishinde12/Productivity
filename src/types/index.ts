export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type Quote = {
  quote: string;
  author: string;
};

export type TodoList = {
  id: string;
  name: string;
  tasks: Task[];
};
