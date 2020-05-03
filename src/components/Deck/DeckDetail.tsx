/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import firebase from "../../Firebase";
import { Collapse, CardBody, Card } from "reactstrap";
import { CardInterface } from "../../interface/CardInterface";
import { DeckInterface } from "../../interface/DeckInterface";

export const DeckDetail = (props: {
  cards: CardInterface[];
  deck: DeckInterface & { key?: string };
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

  return (
    <div>
      <a
        href="#"
        data-toggle="collapse"
        aria-expanded="false"
        aria-controls="collapseExample"
        onClick={handleClick}
      >
        <h4 className="text-left">{deck.deckName}</h4>
      </a>
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            <div>
              <ul className="top-banner">
                {deckCardArray.map((card, index) => (
                  <li key={index}>
                    {/*本当はindexにするのは良くないけど思いつかないので一旦...*/}
                    <img src={card.image} alt="" />
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
