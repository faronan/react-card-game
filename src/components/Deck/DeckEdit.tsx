/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import firebase from "../../Firebase";
import { Link, useHistory, useLocation } from "react-router-dom";
import {
  CardInterface,
  cardColors,
  supportEffects,
  cardtags,
} from "../../interface/CardInterface";

export const DeckEdit = (props: { cards: CardInterface[] }) => {
  const cards = props.cards;
  const [deck, setDeck] = useState<{ [key: string]: number }>({});

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    console.log("The link was clicked.");
  };
  return (
    <div className="col-sm-8">
      <div className="col-sm-6">
        <a href="#" onClick={handleClick}>
          ▼ クリックで展開
        </a>
      </div>
      <form className="form-inline">
        <div className="form-group">
          <label htmlFor="char_name" className="col-form-label">
            デッキ名:
          </label>
          <div className="col-sm-4">
            <input type="text" className="form-control" name="char_name" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          保存
        </button>
      </form>
      <ul className="top-banner">
        {deckCardArray.map((card, index) => (
          <li key={index}>
            {/*本当はindexにするのは良くないけど思いつかないので一旦...*/}
            <button className="batsu" value={card.id} onClick={onCardClick}>
              ×
            </button>
            <img src={card.image} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};
