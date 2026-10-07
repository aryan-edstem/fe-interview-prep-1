import { useRef } from 'react'
import { Link } from 'react-router'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { TodoFilters } from '@/pages/TodoPage/TodoFilters'
import { TodoForm } from '@/pages/TodoPage/TodoForm'
import { TodoItem } from '@/pages/TodoPage/TodoItem'
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  filterTodos,
  isFilter,
  isTodoList,
  renameTodo,
  toggleTodo,
  type Filter,
  type Todo,
} from '@/pages/TodoPage/todos'
import './TodoPage.css'

const NO_TODOS: Todo[] = []
const DEFAULT_FILTER: Filter = 'all'

export default function TodoPage() {
  const [todos, setTodos] = useLocalStorageState('q1-todo:todos', NO_TODOS, isTodoList)
  const [filter, setFilter] = useLocalStorageState('q1-todo:filter', DEFAULT_FILTER, isFilter)
  const visibleTodos = filterTodos(todos, filter)
  const activeCount = todos.filter((todo) => !todo.completed).length
  const hasCompleted = activeCount < todos.length
  const newTodoRef = useRef<HTMLInputElement>(null)

  // Removing todos unmounts the focused control; send keyboard users back to the input.
  function removeTodos(update: (current: Todo[]) => Todo[]) {
    setTodos(update)
    newTodoRef.current?.focus()
  }

  return (
    <main className="todo-page">
      <Link to="/" className="todo-page__back">
        ← All questions
      </Link>
      <header className="todo-page__header">
        <h1 className="todo-page__title">Todos</h1>
      </header>
      <div className="todo-card">
        <TodoForm
          ref={newTodoRef}
          onAdd={(title) => {
            setTodos((current) => addTodo(current, title))
          }}
        />
        {todos.length === 0 ? (
          <p className="todo-card__empty">Nothing to do yet. Add your first todo above.</p>
        ) : (
          <>
            {visibleTodos.length === 0 ? (
              <p className="todo-card__empty">No {filter} todos.</p>
            ) : (
              <ul className="todo-list" aria-label="Todos">
                {visibleTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={(id) => {
                      setTodos((current) => toggleTodo(current, id))
                    }}
                    onRename={(id, title) => {
                      setTodos((current) => renameTodo(current, id, title))
                    }}
                    onDelete={(id) => {
                      removeTodos((current) => deleteTodo(current, id))
                    }}
                  />
                ))}
              </ul>
            )}
            <footer className="todo-footer">
              <p className="todo-footer__count" aria-live="polite">
                {activeCount} {activeCount === 1 ? 'item' : 'items'} left
              </p>
              <TodoFilters value={filter} onChange={setFilter} />
              <button
                type="button"
                className="todo-footer__clear"
                disabled={!hasCompleted}
                onClick={() => {
                  removeTodos(clearCompleted)
                }}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
    </main>
  )
}
