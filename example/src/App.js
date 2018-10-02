import React, { Component } from 'react';

// import ExampleComponent from 'redivide'
import Pane from 'redivide';

const MyDiv = () => (
  <div
    className="my-div"
    style={{ background: `hsl(${Math.random() * 360}, 50%, 45%)` }}
  />
);
export default class App extends Component {
  render() {
    return (
      <Pane defaultComponent={<MyDiv />}>
        <MyDiv />
      </Pane>
    );
  }
}
