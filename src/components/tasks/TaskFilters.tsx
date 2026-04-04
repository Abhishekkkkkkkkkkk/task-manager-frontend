'use client';
import { useCallback, useState } from 'react';
import { TaskFilters as Filters, TaskStatus } from '@/types';
import { Search, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const statuses: { label: string; value: TaskStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const TaskFiltersBar = ({ filters, onChange }: TaskFiltersProps) => {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...filters, search, page: 1 });
  }, [filters, onChange, search]);

  const clearSearch = () => {
    setSearch('');
    onChange({ ...filters, search: undefined, page: 1 });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {search && (
          <button type="button" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {statuses.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => onChange({ ...filters, status: value, page: 1 })}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
              filters.status === value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};