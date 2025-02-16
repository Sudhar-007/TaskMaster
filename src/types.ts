export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  points: number;
  category: string;
  completedAt?: Date;
}

export interface UserProfile {
  points: number;
  rank: string;
  tasksCompleted: number;
  streak: number;
  precision: number;
  lastCompletedDate: string | null;
  dailyTasksCompleted: number;
  lastDailyReset: string;
  lastMonthlyReset: string;
  username: string;
}

export interface Rank {
  name: string;
  minPoints: number;
  maxPoints: number;
}

export interface User {
  username: string;
  password: string;
}