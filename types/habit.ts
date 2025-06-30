export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  targetMinutes: number;
  streak: number;
  totalMinutes: number;
  completedToday: boolean;
  createdAt: Date;
  lastCompletedAt?: Date;
  sessions: HabitSession[];
}

export interface HabitSession {
  id: string;
  habitId: string;
  date: Date;
  minutes: number;
  completed: boolean;
}

export interface FocusSession {
  id: string;
  habitId: string;
  startTime: Date;
  endTime?: Date;
  targetMinutes: number;
  actualMinutes: number;
  isActive: boolean;
}