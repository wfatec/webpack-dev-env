import React from 'react'
import { Action, withStateMachine } from 'react-automata'

const statechart = {
  initial: 'a',
  states: {
    a: {
      on: {
        NEXT: 'b',
      },
      onEntry: 'sayHello',
    },
    b: {
      on: {
        NEXT: 'a',
      },
      onEntry: 'sayCiao',
    },
  },
}

const App = (props) => {
    const handleClick = () => {
        props.transition('NEXT')
    }

    return (
        <div>
            <button onClick={handleClick}>NEXT</button>
            <Action is="sayHello">Hello, A</Action>
            <Action is="sayCiao">Ciao, B</Action>
        </div>
    )
}

export default withStateMachine(statechart)(App)