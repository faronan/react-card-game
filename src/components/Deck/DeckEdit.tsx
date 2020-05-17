/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import firebase from "../../Firebase";
import { CardInterface } from "../../interface/CardInterface";
import { DeckInterface } from "../../interface/DeckInterface";
import "../../css/style.css";

export const DeckEdit = (props: {
  cards: CardInterface[];
  deck: DeckInterface & { key?: string };
  setDeck: React.Dispatch<React.SetStateAction<DeckInterface>>;
  addDeck: (key: string) => void;
}) => {
  const cards = props.cards;
  const deck = props.deck;
  const setDeck = props.setDeck;

  const onCardDeleteClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
      .then((docRef) => {
        const key = docRef.id;
        props.addDeck(key);
        const initialDeck: DeckInterface = {
          deckName: "",
          cardIdCount: {},
          HeroCardId: 0,
        };
        setDeck(initialDeck);
      })
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
  };

  const heroCardValidate = (cardId: number) => {
    const card = cards.find((card) => Number(card.id) === cardId);
    return card !== undefined && Number(card.cost) === 1;
  };

  const onCardClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    const cardId = Number(e.currentTarget.getAttribute("data-item"));
    if (heroCardValidate(cardId)) {
      setDeck({
        ...deck,
        HeroCardId: cardId,
      });
    }
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
          <li key={index} className="deck-card-base">
            {/*本当はindexにするのは良くないけど思いつかないので一旦...*/}
            <button
              className="batsu"
              value={card.id}
              onClick={onCardDeleteClick}
            >
              ×
            </button>
            <img
              src={card.image}
              alt=""
              onClick={onCardClick}
              data-item={card.id}
            />
            {Number(card.id) === deck.HeroCardId && (
              // <span className="badge badge-danger badge-pill ">
              //   主人公
              // </span>
              <svg
                className="badge-edit"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-40 -40 440 440"
              >
                <circle
                  className="outer"
                  fill="#F9D535"
                  stroke="#fff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  cx="180"
                  cy="180"
                  r="157"
                />
                <circle
                  className="inner"
                  fill="#DFB828"
                  stroke="#fff"
                  strokeWidth="8"
                  cx="180"
                  cy="180"
                  r="108.3"
                />
                <path
                  className="inline"
                  d="M89.4 276.7c-26-24.2-42.2-58.8-42.2-97.1 0-22.6 5.6-43.8 15.5-62.4m234.7.1c9.9 18.6 15.4 39.7 15.4 62.2 0 38.3-16.2 72.8-42.1 97"
                  stroke="#CAA61F"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <g className="star">
                  <path
                    fill="#F9D535"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M180 107.8l16.9 52.1h54.8l-44.3 32.2 16.9 52.1-44.3-32.2-44.3 32.2 16.9-52.1-44.3-32.2h54.8z"
                  />
                  <circle
                    fill="#DFB828"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx="180"
                    cy="107.8"
                    r="4.4"
                  />
                  <circle
                    fill="#DFB828"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx="223.7"
                    cy="244.2"
                    r="4.4"
                  />
                  <circle
                    fill="#DFB828"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx="135.5"
                    cy="244.2"
                    r="4.4"
                  />
                  <circle
                    fill="#DFB828"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx="108.3"
                    cy="160.4"
                    r="4.4"
                  />
                  <circle
                    fill="#DFB828"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    cx="251.7"
                    cy="160.4"
                    r="4.4"
                  />
                </g>
              </svg>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
