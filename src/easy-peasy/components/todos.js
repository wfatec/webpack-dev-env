import React from 'react'
import { useStore, useAction } from 'easy-peasy'
import Todo from './todo'
import AddTodo from './add-todo'

function Todos() {
  const todos = useStore(state => state.todos.items)
  const toggle = useAction(actions => actions.todos.toggle)
  const todosList = Object.values(todos)
  return (
    <div>
      {todosList.map(todo => (
        <Todo key={todo.id} todo={todo} toggle={toggle} />
      ))}
      <AddTodo />
    </div>
  )
}

export default Todos
