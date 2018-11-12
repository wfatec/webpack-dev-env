import React, { useState } from 'react';
import ReactDOM from "react-dom";
import Saber from './img/saber.jpg';
const Hooks = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
};

export default Hooks;

ReactDOM.render(<Hooks />, document.getElementById("root"));