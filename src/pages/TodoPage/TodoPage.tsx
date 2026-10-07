import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { TodoForm } from '@/pages/TodoPage/TodoForm'
import { addTodo, isTodoList, type Todo } from '@/pages/TodoPage/todos'
import './TodoPage.css'

const NO_TODOS: Todo[] = []

export default function TodoPage() {
  const [todos, setTodos] = useLocalStorageState('q1-todo:todos', NO_TODOS, isTodoList)

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
        <ul className="todo-list" aria-label="Todos">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              {todo.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
