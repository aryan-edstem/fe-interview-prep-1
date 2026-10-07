import { useEffect, useRef, useState, type KeyboardEvent, type SubmitEvent } from 'react'
import type { Todo } from '@/pages/TodoPage/todos'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onRename, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef(false)
  // Set once Enter/Escape ends the edit, so the trailing blur from unmounting the input is ignored.
  const editFinished = useRef(false)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      editButtonRef.current?.focus()
    }
  }, [isEditing])

  function startEditing() {
    editFinished.current = false
    setDraft(todo.title)
    setIsEditing(true)
  }

  function save() {
    if (editFinished.current) return
    editFinished.current = true
    onRename(todo.id, draft)
    setIsEditing(false)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    restoreFocus.current = true
    save()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Escape') return
    editFinished.current = true
    restoreFocus.current = true
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="todo-item">
        <form className="todo-item__edit" onSubmit={handleSubmit}>
          <label htmlFor={`edit-${todo.id}`} className="visually-hidden">
            Edit &quot;{todo.title}&quot;
          </label>
          <input
            ref={inputRef}
            id={`edit-${todo.id}`}
            className="todo-item__input"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            onBlur={save}
          />
        </form>
      </li>
    )
  }

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
        ref={editButtonRef}
        type="button"
        aria-label={`Edit "${todo.title}"`}
        onClick={startEditing}
      >
        Edit
      </button>
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
