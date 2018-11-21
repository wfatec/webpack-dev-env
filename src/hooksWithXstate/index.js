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

export default ( props ) => {
  
  const [authState, setAuthState] = useState(appMachine.initialState.value);
  const [error, setError] = useState('');
  // const [logout] = useState(e => handleLogout(e));
  const [user, setUser] = useState({});
  const logout = (e) => {
    e.preventDefault();
    transition({ type: 'LOGOUT' });
  }
  const CTXState = {
    authState,
    logout,
    user,
  }
  console.log('--------------')
  const transition = (event) => {
    const nextAuthState = appMachine.transition(authState, event.type);
    console.log(nextAuthState)
    const nextState = nextAuthState.actions.reduce(
      (state, action) => command(action.type, event) || state,
      undefined,
    );
    setAuthState(nextAuthState.value);
  }

  const command = (action, event) => {
    switch (action) {
      case 'setUser':
        if (event.username) {
          setUser({ name: event.username });
        }
        break;
      case 'unsetUser':
        setUser({});
      case 'error':
        if (event.error) {
          setError(event.error);
        }
        break;
      default:
        break;
    }
  }

  return (
    <Auth.Provider value={CTXState}>
      <div className="w5">
        <div className="mb2">{error}</div>
        {authState === 'loggedIn' ? (
          <Dashboard />
        ) : (
          <Login transition={event => transition(event)} />
        )}
      </div>
    </Auth.Provider>
  )
}

export class App1 extends React.Component {
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