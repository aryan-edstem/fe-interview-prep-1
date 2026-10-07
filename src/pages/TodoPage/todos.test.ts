import { describe, expect, it } from 'vitest'
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  filterTodos,
  isFilter,
  isTodoList,
  renameTodo,
  toggleTodo,
  type Todo,
} from '@/pages/TodoPage/todos'

const milk: Todo = { id: '1', title: 'Buy milk', completed: false }
const walk: Todo = { id: '2', title: 'Walk dog', completed: true }

describe('addTodo', () => {
  it('appends a trimmed, incomplete todo', () => {
    const [todo] = addTodo([], '  Buy milk  ')

    expect(todo).toMatchObject({ title: 'Buy milk', completed: false })
  })

  it.each(['', '   ', '\t\n'])('ignores the blank title %j', (title) => {
    const todos = [milk]

    expect(addTodo(todos, title)).toBe(todos)
  })
})

describe('renameTodo', () => {
  it('updates the matching todo with a trimmed title', () => {
    expect(renameTodo([milk, walk], '1', ' Buy oat milk ')).toEqual([
      { ...milk, title: 'Buy oat milk' },
      walk,
    ])
  })

  it('ignores a blank title', () => {
    const todos = [milk]

    expect(renameTodo(todos, '1', '  ')).toBe(todos)
  })
})

describe('toggleTodo / deleteTodo / clearCompleted', () => {
  it('toggles completion of the matching todo only', () => {
    expect(toggleTodo([milk, walk], '1')).toEqual([{ ...milk, completed: true }, walk])
  })

  it('deletes the matching todo', () => {
    expect(deleteTodo([milk, walk], '1')).toEqual([walk])
  })

  it('removes completed todos', () => {
    expect(clearCompleted([milk, walk])).toEqual([milk])
  })
})

describe('filterTodos', () => {
  it.each([
    ['all', [milk, walk]],
    ['active', [milk]],
    ['completed', [walk]],
  ] as const)('shows %s todos', (filter, expected) => {
    expect(filterTodos([milk, walk], filter)).toEqual(expected)
  })
})

describe('guards', () => {
  it('accepts valid stored data', () => {
    expect(isTodoList([milk, walk])).toBe(true)
    expect(isFilter('active')).toBe(true)
  })

  it('rejects malformed stored data', () => {
    expect(isTodoList([{ id: 1, title: 'x', completed: false }])).toBe(false)
    expect(isTodoList({})).toBe(false)
    expect(isFilter('done')).toBe(false)
  })
})
