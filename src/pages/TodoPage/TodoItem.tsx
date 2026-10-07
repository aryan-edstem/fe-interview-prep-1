import type { Todo } from '@/pages/TodoPage/todos'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={todo.completed ? 'todo-item todo-item--completed' : 'todo-item'}>
      <label className="todo-item__label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => {
            onToggle(todo.id)
          }}
        />
        <span className="todo-item__title">{todo.title}</span>
      </label>
      <button
        type="button"
        aria-label={`Delete "${todo.title}"`}
        onClick={() => {
          onDelete(todo.id)
        }}
      >
        Delete
      </button>
    </li>
  )
}
