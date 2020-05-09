/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import { Link, useLocation } from "react-router-dom";
import { CardInterface } from "../../interface/CardInterface";
import "../../css/style.css";
import { DeckEdit } from "./DeckEdit";
import { DeckInterface } from "../../interface/DeckInterface";
import { DeckDetail } from "./DeckDetail";

export const Deck = () => {
  const location = useLocation();
  interface state {
    cards: CardInterface[];
  }
  const state = location.state as state;
  const cards = state["cards"];

  const initialDeck: DeckInterface = {
    deckName: "",
    cardIdCount: {},
  };

  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [deck, setDeck] = useState<DeckInterface>(initialDeck);
  const [decks, setDecks] = useState<(DeckInterface & { key?: string })[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: Number(e.target.value) });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = e.currentTarget.name;
    setDeck({
      ...deck,
      cardIdCount: {
        ...deck.cardIdCount,
        [key]: (deck.cardIdCount[key] || 0) + (values[key] || 1),
      },
    });
  };

  const addDeck = () => {
    setDecks([...decks, deck]);
  };

  useEffect(() => {
    (async () => {
      firebase
        .firestore()
        .collection("decks")
        .get()
        .then((querySnapshot) => {
          const decks = querySnapshot.docs.map((doc) => {
            const data = doc.data() as DeckInterface;
            return { ...data, key: doc.id };
          });
          setDecks(decks);
          setIsLoaded(true);
        });
    })();
  }, []);

  return !isLoaded ? (
    <div id="back">
      <div id="rotate">
        <div id="move">
          <div id="dot"></div>
        </div>
        <div id="ring"></div>
      </div>
      <p>loading...</p>
    </div>
  ) : (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Deck List</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">Card List</Link>
          </h4>
          <div className="row">
            <div className="col-sm-4 table-responsive">
              <table className="table table-stripe">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  {cards.map((card) => {
                    const key = card.id.toString();
                    return (
                      <tr key={card.id}>
                        <td>
                          <img src={card.image} alt="" className="list-image" />
                        </td>
                        <td>
                          <form onSubmit={onSubmit} name={key}>
                            <select
                              value={values[key]}
                              name={key}
                              onChange={onChange}
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                            <button
                              type="submit"
                              className="btn-sm btn-success"
                            >
                              追加
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-sm-8">
              <ul className="list-group">
                {decks.map((d) => (
                  <li className={"list-group-item"}>
                    <DeckDetail cards={cards} deck={d}></DeckDetail>
                  </li>
                ))}
              </ul>
              <div className="row border-bottom h-margine">
                <h4 className="text-left">新しいデッキ</h4>
              </div>
              <DeckEdit
                cards={cards}
                deck={deck}
                setDeck={setDeck}
                addDeck={addDeck}
              ></DeckEdit>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
