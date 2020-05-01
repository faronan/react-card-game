/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { Edit } from "./components/Card/Edit";
import { Create } from "./components/Card/Create";
import { Show } from "./components/Card/Show";
import { Home } from "./components/Home";
import firebase from "./Firebase";

const NotFound = () => {
  return <h2>ページが見つかりません</h2>;
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/edit/:id" component={Edit} />
        <Route path="/create" component={Create} />
        <Route path="/show/:id" component={Show} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
