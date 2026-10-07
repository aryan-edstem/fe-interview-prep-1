import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '@/App'

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('renders the home route with a link to each question', async () => {
    renderAt('/')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'FE Interview Prep' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Todo App' })).toHaveAttribute('href', '/q1-todo')
  })

  it('renders the todo page at /q1-todo', async () => {
    renderAt('/q1-todo')

    expect(await screen.findByRole('heading', { level: 1, name: 'Todos' })).toBeInTheDocument()
  })
})
