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

  it('marks a todo complete and back to active', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk')
    const checkbox = screen.getByRole('checkbox', { name: 'Buy milk' })

    await user.click(checkbox)
    expect(checkbox).toBeChecked()

    await user.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('deletes a todo', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk', 'Walk dog')

    await user.click(screen.getByRole('button', { name: 'Delete "Buy milk"' }))

    expect(within(todoList()).queryByText('Buy milk')).not.toBeInTheDocument()
    expect(within(todoList()).getByText('Walk dog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'New todo' })).toHaveFocus()
  })

  it('edits a todo and saves on Enter', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Edit "Buy milk"' }))
    const input = screen.getByRole('textbox', { name: 'Edit "Buy milk"' })
    expect(input).toHaveFocus()
    await user.clear(input)
    await user.type(input, 'Buy oat milk{Enter}')

    expect(within(todoList()).getByText('Buy oat milk')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit "Buy oat milk"' })).toHaveFocus()
  })

  it('saves an edit when the input loses focus', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Edit "Buy milk"' }))
    await user.type(screen.getByRole('textbox', { name: 'Edit "Buy milk"' }), ' and eggs')
    await user.click(screen.getByRole('heading', { name: 'Todos' }))

    expect(within(todoList()).getByText('Buy milk and eggs')).toBeInTheDocument()
  })

  it('cancels an edit on Escape', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Edit "Buy milk"' }))
    await user.type(screen.getByRole('textbox', { name: 'Edit "Buy milk"' }), ' and eggs{Escape}')

    expect(within(todoList()).getByText('Buy milk')).toBeInTheDocument()
  })

  it('keeps the original title when an edit is left blank', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Edit "Buy milk"' }))
    const input = screen.getByRole('textbox', { name: 'Edit "Buy milk"' })
    await user.clear(input)
    await user.type(input, '   {Enter}')

    expect(within(todoList()).getByText('Buy milk')).toBeInTheDocument()
  })

  it('filters by All, Active and Completed', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk', 'Walk dog')
    await user.click(screen.getByRole('checkbox', { name: 'Walk dog' }))

    await user.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(todoList()).getByText('Buy milk')).toBeInTheDocument()
    expect(within(todoList()).queryByText('Walk dog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    expect(within(todoList()).queryByText('Buy milk')).not.toBeInTheDocument()
    expect(within(todoList()).getByText('Walk dog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(within(todoList()).getAllByRole('listitem')).toHaveLength(2)
  })

  it('shows how many items are left', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk')
    expect(screen.getByText('1 item left')).toBeInTheDocument()

    await addTodos(user, 'Walk dog')
    expect(screen.getByText('2 items left')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Buy milk' }))
    expect(screen.getByText('1 item left')).toBeInTheDocument()
  })

  it('clears completed todos', async () => {
    const { user } = setup()
    await addTodos(user, 'Buy milk', 'Walk dog')
    const clearButton = screen.getByRole('button', { name: 'Clear completed' })
    expect(clearButton).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: 'Walk dog' }))
    await user.click(clearButton)

    expect(within(todoList()).queryByText('Walk dog')).not.toBeInTheDocument()
    expect(within(todoList()).getByText('Buy milk')).toBeInTheDocument()
    expect(clearButton).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'New todo' })).toHaveFocus()
  })

  it('keeps todos and the selected filter after a page refresh', async () => {
    const { user, unmount } = setup()
    await addTodos(user, 'Buy milk', 'Walk dog')
    await user.click(screen.getByRole('checkbox', { name: 'Walk dog' }))
    await user.click(screen.getByRole('button', { name: 'Completed' }))
    unmount()

    render(<TodoPage />)

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(todoList()).getByText('Walk dog')).toBeInTheDocument()
    expect(within(todoList()).queryByText('Buy milk')).not.toBeInTheDocument()
  })
})
