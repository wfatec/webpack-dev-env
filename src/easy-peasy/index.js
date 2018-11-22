import React from 'react'
import { StoreProvider, createStore } from 'easy-peasy'

import model from './model'
import App from './components/app'

const store = createStore(model)

export default function Root() {
  return (
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  )
}