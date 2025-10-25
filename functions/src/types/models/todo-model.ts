// functions/src/types/models.ts

import { Timestamp } from 'firebase-admin/firestore'

// ──────────────────────────────────────────────────────────────────────────────
// ENUMS
// ──────────────────────────────────────────────────────────────────────────────

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light'
}

export enum ReminderType {
  TASK_DUE = 'task_due',
  DAILY_REMINDER = 'daily_reminder',
  CUSTOM = 'custom'
}

// ──────────────────────────────────────────────────────────────────────────────
// БАЗОВЫЕ ИНТЕРФЕЙСЫ
// ──────────────────────────────────────────────────────────────────────────────

export interface BaseDocument {
  created_time?: Timestamp;
  updated_time?: Timestamp;
}

// ──────────────────────────────────────────────────────────────────────────────
// ОСНОВНЫЕ МОДЕЛИ (ТОЧНОЕ СООТВЕТСТВИЕ FLUTTER FLOW)
// ──────────────────────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  created_time: Timestamp;
  last_active_time: Timestamp;
  theme: Themes;
  is_enabled_notifications: boolean;
  daily_reminder_time: string;
  total_tasks: number;
  completed_tasks: number;
  email?: string;
  display_name?: string;
  photo_url?: string;
  phone_number?: string;
}

export interface List extends BaseDocument {
  owner_id: string;
  title: string;
  color: string;
  icon: string;
  order?: number;
  is_archived?: boolean;
  task_count?: number;
}

export interface Task extends BaseDocument {
  list_id?: string;
  owner_id?: string;
  title?: string;
  order?: number;
  due_date?: Timestamp;
  priority?: Priority;
  notes?: string;
  is_completed?: boolean;
}

export interface Reminder extends BaseDocument {
  task_id?: string;
  owner_id?: string;
  trigger_time?: Timestamp;
  is_sent?: boolean;
  type?: ReminderType;
}

// ──────────────────────────────────────────────────────────────────────────────
// ВСПОМОГАТЕЛЬНЫЕ ТИПЫ
// ──────────────────────────────────────────────────────────────────────────────

export interface FirestoreChange<T> {
  before: FirebaseFirestore.DocumentSnapshot<T>;
  after: FirebaseFirestore.DocumentSnapshot<T>;
}

export interface FunctionContext {
  params: {
    [key: string]: string;
  };
  timestamp: string;
  eventId: string;
}


