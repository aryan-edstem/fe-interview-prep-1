import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { App } from '@/App'

describe('App', () => {
  it('renders the home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'FE Interview Prep' })).toBeInTheDocument()
  })
})
