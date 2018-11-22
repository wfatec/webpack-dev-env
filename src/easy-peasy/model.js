import { effect } from 'easy-peasy'
import mockService from './mock-service'

export default {
  preferences: {
    theme: 'light',
    // actions
    toggle: state => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
  todos: {
    items: {},
    // actions
    fetched: (state, payload) => {
      state.items = payload.reduce((acc, todo) => {
        acc[todo.id] = todo
        return acc
      }, {})
    },
    saved: (state, payload) => {
      state.items[payload.id] = payload
    },
    // effects
    fetchTodos: effect(async dispatch => {
      const todos = await mockService.fetchTodos()
      dispatch.todos.fetched(todos)
    }),
    toggle: effect(async (dispatch, payload, { getState }) => {
      const todo = getState().todos.items[payload]
      if (!todo) return
      const updated = await mockService.updateTodo(payload, {
        done: !todo.done,
      })
      dispatch.todos.saved(updated)
    }),
    save: effect(async (dispatch, payload) => {
      const todo = await mockService.saveTodo(payload)
      dispatch.todos.saved(todo)
    }),
  },
  // effects
  initialise: effect(async dispatch => {
    await dispatch.todos.fetchTodos()
  }),
}
