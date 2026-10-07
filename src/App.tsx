import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

const HomePage = lazy(() => import('@/pages/HomePage'))
const TodoPage = lazy(() => import('@/pages/TodoPage/TodoPage'))

export function App() {
  return (
    <Suspense fallback={<p role="status">Loading…</p>}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="q1-todo" element={<TodoPage />} />
      </Routes>
    </Suspense>
  )
}
