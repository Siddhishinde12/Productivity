export type Task = {
  id: string;
  text: string;
  description?: string;
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

export type Vision = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  completed: boolean;
};

export type Workout = {
  id: string;
  date: string;
  type: string;
  duration: number; // in minutes
};
    
export type TravelPlan = {
  id: string;
  destination: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  status: 'planned' | 'completed' | 'bucket-list';
  departureDate?: string;
};
