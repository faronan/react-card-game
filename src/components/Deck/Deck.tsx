/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import firebase from "../../Firebase";
import { Link, useLocation } from "react-router-dom";
import { CardInterface } from "../../interface/CardInterface";
import "../../css/style.css";

export const Deck = () => {
  const location = useLocation();
  interface state {
    cards: CardInterface[];
  }
  const state = location.state as state;
  const cards = state["cards"];

  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [deck, setDeck] = useState<{ [key: string]: number }>({});

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: Number(e.target.value) });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = e.currentTarget.name;
    setDeck({ ...deck, [key]: (deck[key] || 0) + (values[key] || 1) });
  };

  const onCardClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const key = e.currentTarget.value;
    setDeck({ ...deck, [key]: deck[key] - 1 });
  };

  const deckCardArray: CardInterface[] = Object.entries(deck)
    .map(([cardId, count]) => {
      const card = cards.find((card) => card.id.toString() === cardId);
      return Array(count).fill(card!);
    })
    .flat();

  return (
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
                          <img src={card.image} alt="" />
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
            <ul className="col-sm-8 top-banner">
              {deckCardArray.map((card, index) => (
                <li key={index}>
                  {/*本当はindexにするのは良くないけど思いつかないので一旦...*/}
                  <button
                    className="batsu"
                    value={card.id}
                    onClick={onCardClick}
                  >
                    ×
                  </button>
                  <img src={card.image} alt="" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
