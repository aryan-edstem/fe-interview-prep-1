import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import TodoPage from '@/pages/TodoPage/TodoPage'

function setup() {
  const user = userEvent.setup()
  const view = render(<TodoPage />)
  return { user, ...view }
}

async function addTodos(user: ReturnType<typeof userEvent.setup>, ...titles: string[]) {
  for (const title of titles) {
    await user.type(screen.getByRole('textbox', { name: 'New todo' }), `${title}{Enter}`)
  }
}

function todoList() {
  return screen.getByRole('list', { name: 'Todos' })
}

afterEach(() => {
  localStorage.clear()
})

describe('TodoPage', () => {
  it('shows an empty state before any todos are added', () => {
    setup()

    expect(screen.getByText(/nothing to do yet/i)).toBeInTheDocument()
  })

  it('adds a todo and clears the input', async () => {
    const { user } = setup()

    await addTodos(user, 'Buy milk')

    expect(within(todoList()).getByText('Buy milk')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'New todo' })).toHaveValue('')
  })

  it('ignores empty and whitespace-only titles', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await addTodos(user, '    ')

    expect(screen.queryByRole('list', { name: 'Todos' })).not.toBeInTheDocument()
  })

  it('keeps todos after a page refresh', async () => {
    const { user, unmount } = setup()
    await addTodos(user, 'Buy milk')
    unmount()

    render(<TodoPage />)

    expect(within(todoList()).getByText('Buy milk')).toBeInTheDocument()
  })
})
