import React, { useEffect } from 'react'
import { useAction } from 'easy-peasy'
import Theme from './theme'
import Todos from './todos'

export default function App() {
  const initialise = useAction(actions => actions.initialise)
  useEffect(() => {
    initialise()
  })
  return (
    <Theme>
      <h1 style={{ margin: 0 }}>Todo</h1>
      <Todos />
    </Theme>
  )
}
