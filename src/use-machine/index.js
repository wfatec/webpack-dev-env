import React, { useContext } from 'react'
import ReactDOM from 'react-dom'
import { matchesState } from 'xstate'
import { assign } from 'xstate/lib/actions'
import { useMachine } from 'use-machine'

import './styles.css'

const incAction = assign(exState => ({ counter: exState.counter + 1 }))
const sideEffect = assign(() => {console.log('sideEffect')})

const machineConfig = {
  initial: 'Off',
  context: {
    counter: 0
  },
  states: {
    Off: { on: { Tick: { target: 'On', actions: [incAction, sideEffect] } } },
    On: { on: { Tick: { target: 'Off', actions: ['incActionInOption'] } } }
  }
}

const MachineContext = React.createContext()

export default function App() {
  const machine = useMachine(machineConfig, {
    actions: {
    //   sideEffect: (props) => console.log('sideEffect: ',props),
      incActionInOption: assign(exState => ({ counter: exState.counter + 1 }))
    }
  })

  console.log(machine)

  function sendTick() {
    machine.send('Tick')
  }

  return (
    <div className="App">
      <span
        style={{
          backgroundColor: matchesState(machine.state, 'Off') ? 'red' : 'yellow'
        }}
      >
        {matchesState(machine.state, 'Off') ? 'Off' : 'On'}
      </span>
      <button onClick={sendTick}>Tick</button>
      Pressed: {machine.exState.counter} times
      <MachineContext.Provider value={machine}>
        <div className="childs">
          <Child />
        </div>
      </MachineContext.Provider>
    </div>
  )
}

function Child() {
  const machine = useContext(MachineContext)
  return (
    <div>
      <div>
        Child state: {matchesState(machine.state, 'Off') ? 'Off' : 'On'}
      </div>
      <div>Child count: {machine.exState.counter}</div>
      <OtherChild />
    </div>
  )
}

function OtherChild() {
  const machine = useContext(MachineContext)

  function sendTick() {
    machine.send('Tick')
  }
  return (
    <div>
      <div>
        OtherChild state: {matchesState(machine.state, 'Off') ? 'Off' : 'On'}
      </div>
      <div>OtherChild count: {machine.exState.counter}</div>
      <button onClick={sendTick}>Tick 2</button>
    </div>
  )
}