import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import { Link, useLocation } from "react-router-dom";
import { CardInterface } from "../../interface/CardInterface";
import "../../css/style.css";
import { DeckEdit } from "./DeckEdit";
import { DeckInterface } from "../../interface/DeckInterface";
import { DeckDetail } from "./DeckDetail";
import Pagination from "react-js-pagination";

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
    HeroCardId: 0,
  };

  const LIMIT = 10;

  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [newDeck, setNewDeck] = useState<DeckInterface>(initialDeck);
  const [decks, setDecks] = useState<(DeckInterface & { key?: string })[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: Number(e.target.value) });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const key = e.currentTarget.name;
    setNewDeck({
      ...newDeck,
      cardIdCount: {
        ...newDeck.cardIdCount,
        [key]: (newDeck.cardIdCount[key] || 0) + (values[key] || 1),
      },
    });
  };

  const addDeck = (key: string) => {
    setDecks([...decks, { ...newDeck, key: key }]);
  };

  const deleteDeck = (deck: DeckInterface) => {
    const deletedAfterDecks = decks.filter((d) => d !== deck);
    setDecks(deletedAfterDecks);
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
          <h3 className="panel-title">デッキ一覧</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">カード一覧</Link>
          </h4>
          <div className="row">
            <div className="col-sm-4 table-responsive">
              <Pagination
                activePage={page}
                itemsCountPerPage={LIMIT}
                totalItemsCount={cards.length}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => handlePageChange(pageNumber)}
                itemClass="page-item"
                linkClass="page-link"
              />
              <table className="table table-stripe">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  {cards.slice((page - 1) * LIMIT, page * LIMIT).map((card) => {
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
              <Pagination
                activePage={page}
                itemsCountPerPage={LIMIT}
                totalItemsCount={cards.length}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => handlePageChange(pageNumber)}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
            <div className="col-sm-8">
              <ul className="list-group">
                {decks.map((d) => (
                  <li className={"list-group-item"} key={d.key}>
                    <DeckDetail
                      cards={cards}
                      deck={d}
                      deleteDeck={deleteDeck}
                    ></DeckDetail>
                  </li>
                ))}
              </ul>
              <div className="row border-bottom h-margine">
                <h4 className="text-left">新しいデッキ</h4>
              </div>
              <DeckEdit
                cards={cards}
                deck={newDeck}
                setDeck={setNewDeck}
                addDeck={addDeck}
              ></DeckEdit>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
