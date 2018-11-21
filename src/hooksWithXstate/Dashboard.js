import React, {useContext} from 'react';
import { Auth } from './index';

export const Dashboard1 = () => (
    <Auth.Consumer>
      {({ user, logout }) => (
        <div>
          <div>Hello {user.name}</div>
          <button onClick={e => logout(e)}>
            Logout
          </button>
        </div>
      )}
    </Auth.Consumer>
);

export const Dashboard = () => {
  const {user, logout} = useContext(Auth)
  console.log(user)
  return (
    <div>
      <div>Hello {user.name}</div>
      <button onClick={e => logout(e)}>
        Logout
      </button>
    </div>
  )
};