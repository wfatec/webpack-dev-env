import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { appMachine } from './appMachine';
import { Login } from './Login';
import { Dashboard } from './Dashboard';

export const Auth = React.createContext({
  authState: 'login',
  logout: () => {},
  user: {},
});



export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: appMachine.initialState.value,
      error: '',
      logout: e => this.logout(e),
      user: {},
    };
  }

  transition(event) {
    const nextAuthState = appMachine.transition(this.state.authState, event.type);
    const nextState = nextAuthState.actions.reduce(
      (state, action) => this.command(action, event) || state,
      undefined,
    );
    this.setState({
      authState: nextAuthState.value,
      ...nextState,
    });
  }

  command(action, event) {
    switch (action) {
      case 'setUser':
        if (event.username) {
          return { user: { name: event.username } };
        }
        break;
      case 'unsetUser':
        return {
          user: {},
        };
      case 'error':
        if (event.error) {
          return {
            error: event.error,
          };
        }
        break;
      default:
        break;
    }
  }

  logout(e) {
    e.preventDefault();
    this.transition({ type: 'LOGOUT' });
  }

  render() {
    return (
      <Auth.Provider value={this.state}>
        <div className="w5">
          <div className="mb2">{this.state.error}</div>
          {this.state.authState === 'loggedIn' ? (
            <Dashboard />
          ) : (
            <Login transition={event => this.transition(event)} />
          )}
        </div>
      </Auth.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));