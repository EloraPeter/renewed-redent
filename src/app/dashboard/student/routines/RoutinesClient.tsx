'use client';

import { Routine } from '@/types/routine';
import { Trash2, Edit, Plus } from 'lucide-react';

interface RoutinesClientProps {
  routines: Routine[];
  onDelete: (id: string) => void;
}

export default function RoutinesClient({
  routines,
  onDelete,
}: RoutinesClientProps) {
  return (
    <ul className="space-y-4">
      {routines.map((r: Routine) => (
        <li
          key={r.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <span className="font-medium">{r.title}</span> at{' '}
            <span>{r.time}</span>
          </div>

          <button
            onClick={() => onDelete(r.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        </li>
      ))}
    </ul>
  );
}
