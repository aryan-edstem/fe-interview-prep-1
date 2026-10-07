import { useLocalStorageState } from '@/hooks/useLocalStorageState'
import { TodoForm } from '@/pages/TodoPage/TodoForm'
import { TodoItem } from '@/pages/TodoPage/TodoItem'
import { addTodo, deleteTodo, isTodoList, toggleTodo, type Todo } from '@/pages/TodoPage/todos'
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
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={(id) => {
                setTodos((current) => toggleTodo(current, id))
              }}
              onDelete={(id) => {
                setTodos((current) => deleteTodo(current, id))
              }}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
