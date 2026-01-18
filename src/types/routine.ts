export interface Routine {
  id: string;
  title: string;
  time: string;               // "HH:mm"
  duration_minutes?: number;
  schedule_type: 'daily' | 'weekly' | 'once';
  days?: string[];            // only relevant for weekly
  once_date?: string;         // only relevant for once — ISO string "2025-04-15"
}