import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { TodoFilters } from '@/pages/TodoPage/TodoFilters'
import { TodoForm } from '@/pages/TodoPage/TodoForm'
import { TodoItem } from '@/pages/TodoPage/TodoItem'
import {
  addTodo,
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

  return (
    <main className="todo-page">
      <h1>Todos</h1>
      <TodoForm
        onAdd={(title) => {
          setTodos((current) => addTodo(current, title))
        }}
      />
      {todos.length === 0 ? (
        <p className="todo-page__empty">Nothing to do yet. Add your first todo above.</p>
      ) : (
        <>
          <TodoFilters value={filter} onChange={setFilter} />
          {visibleTodos.length === 0 ? (
            <p className="todo-page__empty">No {filter} todos.</p>
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
                    setTodos((current) => deleteTodo(current, id))
                  }}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
