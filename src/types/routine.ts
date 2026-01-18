export interface Routine {
  id: string;
  title: string;
  time: string;           // from schedule->>'time'
  duration_minutes?: number;
  days?: string[];        // e.g. ['monday', 'tuesday'] or ['daily']
  schedule_type?: string; // e.g. 'daily', 'weekly'
}