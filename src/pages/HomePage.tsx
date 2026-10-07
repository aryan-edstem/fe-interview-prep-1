import { Link } from 'react-router'

export default function HomePage() {
  return (
    <main>
      <h1>FE Interview Prep</h1>
      <ol>
        <li>
          <Link to="/q1-todo">Todo App</Link>
        </li>
      </ol>
    </main>
  )
}
