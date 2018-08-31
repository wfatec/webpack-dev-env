import React from "react";
import ReactDOM from "react-dom";
import Saber from './img/saber.jpg';
const App = () => {
  return (
    <div>
      <img src={Saber} alt='亚瑟王' />
    </div>
  );
};
export default App;
ReactDOM.render(<App />, document.getElementById("root"));