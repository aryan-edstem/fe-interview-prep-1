import { FILTERS, type Filter } from '@/pages/TodoPage/todos'

const LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

interface TodoFiltersProps {
  value: Filter
  onChange: (filter: Filter) => void
}

export function TodoFilters({ value, onChange }: TodoFiltersProps) {
  return (
    <div className="todo-filters" role="group" aria-label="Filter todos">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className="todo-filters__button"
          aria-pressed={filter === value}
          onClick={() => {
            onChange(filter)
          }}
        >
          {LABELS[filter]}
        </button>
      ))}
    </div>
  )
}
