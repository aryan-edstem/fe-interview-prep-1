import { useState, type Ref, type SubmitEvent } from 'react'

interface TodoFormProps {
  onAdd: (title: string) => void
  ref?: Ref<HTMLInputElement>
}

export function TodoForm({ onAdd, ref }: TodoFormProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onAdd(title)
    setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="new-todo" className="visually-hidden">
        New todo
      </label>
      <input
        ref={ref}
        id="new-todo"
        className="todo-form__input"
        placeholder="What needs to be done?"
        autoComplete="off"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value)
        }}
      />
      <button type="submit">Add</button>
    </form>
  )
}
