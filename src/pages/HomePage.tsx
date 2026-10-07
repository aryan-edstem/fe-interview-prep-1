import { Link } from 'react-router'
import './HomePage.css'

const QUESTIONS = [
  {
    path: '/q1-todo',
    title: 'Todo App',
    description: 'Add, edit, complete and filter todos that survive a page refresh.',
  },
]

export default function HomePage() {
  return (
    <main className="home">
      <header className="home__header">
        <p className="home__eyebrow">React + TypeScript</p>
        <h1 className="home__title">FE Interview Prep</h1>
        <p className="home__subtitle">Frontend exercises, one question per page.</p>
      </header>
      <ol className="home__list">
        {QUESTIONS.map((question, index) => (
          <li key={question.path} className="home__card">
            <span className="home__number" aria-hidden="true">
              Q{index + 1}
            </span>
            <div>
              <h2 className="home__card-title">
                <Link to={question.path} className="home__link">
                  {question.title}
                </Link>
              </h2>
              <p className="home__card-description">{question.description}</p>
            </div>
            <span className="home__arrow" aria-hidden="true">
              →
            </span>
          </li>
        ))}
      </ol>
    </main>
  )
}
