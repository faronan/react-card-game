/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { Edit } from "./components/Card/Edit";
import { Create } from "./components/Card/Create";
import { Show } from "./components/Card/Show";
import { Home } from "./components/Home";
import { Deck } from "./components/Deck/Deck";
import { DeckEdit } from "./components/Deck/DeckEdit";
import { DeckCreate } from "./components/Deck/DeckCreate";
import { DeckShow } from "./components/Deck/DeckShow";

const NotFound = () => {
  return <h2>ページが見つかりません</h2>;
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/edit" component={Edit} />
        <Route path="/create" component={Create} />
        <Route path="/show" component={Show} />
        <Route path="/deck" component={Deck} />
        <Route path="/deck/edit" component={DeckEdit} />
        <Route path="/deck/create" component={DeckCreate} />
        <Route path="/deck/show" component={DeckShow} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
