import { createId } from '@/lib/id'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export const FILTERS = ['all', 'active', 'completed'] as const
export type Filter = (typeof FILTERS)[number]

export function isFilter(value: unknown): value is Filter {
  return FILTERS.some((filter) => filter === value)
}

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.completed === 'boolean'
  )
}

export function isTodoList(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo)
}

export function addTodo(todos: Todo[], title: string): Todo[] {
  const trimmed = title.trim()
  if (!trimmed) return todos
  return [...todos, { id: createId(), title: trimmed, completed: false }]
}

export function renameTodo(todos: Todo[], id: string, title: string): Todo[] {
  const trimmed = title.trim()
  if (!trimmed) return todos
  return todos.map((todo) => (todo.id === id ? { ...todo, title: trimmed } : todo))
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id)
}

export function clearCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed)
}

export function filterTodos(todos: Todo[], filter: Filter): Todo[] {
  if (filter === 'active') return todos.filter((todo) => !todo.completed)
  if (filter === 'completed') return todos.filter((todo) => todo.completed)
  return todos
}
