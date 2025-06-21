export interface Task {
  id: string;
  userId: string;
  title: string;
  category: string;
  scheduledTime: string; // "HH:MM"形式
  daysOfWeek: number[]; // [0,1,2,3,4,5,6] 日曜=0
  notificationMinutesBefore: number;
  color: string; // HEXカラーコード
  isActive: boolean;
  createdAt: Date;
}

export interface UserTag {
  id: string;
  userId: string;
  name: string;
  usageCount: number;
  createdAt: Date;
}

export interface TaskRecord {
  id: string;
  taskId: string;
  userId: string;
  date: string; // "YYYY-MM-DD"形式
  status: 'completed' | 'failed' | 'delayed';
  failureTagIds?: string[];
  memo?: string;
  recordedAt: Date;
}

export interface UserStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}