/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import firebase from "../../Firebase";
import { Collapse, CardBody, Card } from "reactstrap";
import { CardInterface } from "../../interface/CardInterface";
import { DeckInterface } from "../../interface/DeckInterface";
import { useHistory } from "react-router-dom";

export const DeckEdit = (props: {
  cards: CardInterface[];
  deck: DeckInterface & { key?: string };
  setDeck: React.Dispatch<React.SetStateAction<DeckInterface>>;
  addDeck: () => void;
}) => {
  const cards = props.cards;
  const deck = props.deck;
  const setDeck = props.setDeck;
  //const history = useHistory();

  const onCardClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const key = e.currentTarget.value;
    setDeck({
      ...deck,
      cardIdCount: {
        ...deck.cardIdCount,
        [key]: deck.cardIdCount[key] - 1,
      },
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeck({
      ...deck,
      deckName: e.target.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    firebase
      .firestore()
      .collection("decks")
      .add(deck)
      .then((a) => {})
      .catch((error) => {
        console.error(error);
      });
    // firebase
    //   .firestore()
    //   .collection("decks")
    //   .doc(deck.key)
    //   .set(deck)
    //   .then((a) => {})
    //   .catch((error) => {
    //     console.error(error);
    //   });
    // history.push({
    //   pathname: "/deck/#",
    //   state: { cards: cards },
    // });
    props.addDeck();
    setDeck({
      deckName: "",
      cardIdCount: {},
    });
  };

  const deckCardArray: CardInterface[] = Object.entries(deck.cardIdCount)
    .map(([cardId, count]) => {
      const card = cards.find((card) => card.id.toString() === cardId);
      return Array(count).fill(card!);
    })
    .flat();

  return (
    <div>
      <form className="form-inline" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="char_name" className="col-form-label">
            デッキ名:
          </label>
          <div className="col-sm-4">
            <input
              type="text"
              className="form-control"
              value={deck.deckName}
              onChange={onChange}
            />
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
