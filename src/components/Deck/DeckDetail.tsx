/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import firebase from "../../Firebase";
import { Collapse, CardBody, Card } from "reactstrap";
import { CardInterface } from "../../interface/CardInterface";
import { DeckInterface } from "../../interface/DeckInterface";
import "../../css/style.css";

export const DeckDetail = (props: {
  cards: CardInterface[];
  deck: DeckInterface & { key?: string };
  deleteDeck: (deck: DeckInterface) => void;
}) => {
  const cards = props.cards;
  const deck = props.deck;
  const [isOpen, setIsOpen] = useState(false);

  const deckCardArray: CardInterface[] = Object.entries(deck.cardIdCount)
    .map(([cardId, count]) => {
      const card = cards.find((card) => card.id.toString() === cardId);
      return Array(count).fill(card!);
    })
    .flat();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // クリックで展開を押した際の挙動
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const onDelete = (deck: DeckInterface & { key?: string }) => {
    console.log(deck.key);
    if (deck.key) {
      firebase
        .firestore()
        .collection("decks")
        .doc(deck.key)
        .delete()
        .then((a) => {
          props.deleteDeck(deck);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <a
        href="#"
        data-toggle="collapse"
        aria-expanded="false"
        aria-controls="collapseExample"
        onClick={handleClick}
      >
        <h4 className="text-left" style={{ display: "inline" }}>
          {deck.deckName}
        </h4>
      </a>
      <div className="float-right">
        <button className="btn btn-danger" onClick={() => onDelete(deck)}>
          削除
        </button>
      </div>
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            <div>
              <ul className="top-banner">
                {deckCardArray.map((card, index) => (
                  <li key={index} className="deck-card-base">
                    {/*本当はindexにするのは良くないけど思いつかないので一旦...*/}
                    <img src={card.image} alt="" />
                    {Number(card.id) === deck.HeroCardId && (
                      // <span className="badge badge-danger badge-pill ">
                      //   主人公
                      // </span>
                      <svg
                        className="badge"
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
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
};
