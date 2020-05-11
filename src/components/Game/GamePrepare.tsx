/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import firebase from "../../Firebase";
import { CardInterface } from "../../interface/CardInterface";
import { DeckInterface } from "../../interface/DeckInterface";
import Modal from "react-modal";
import { ListGroupItem, ListGroup, Tab, Row, Col } from "react-bootstrap";
import "../../css/style.css";

export const GamePrepare = () => {
  const location = useLocation();
  interface state {
    cards: CardInterface[];
  }
  const state = location.state as state;
  const cards = state["cards"];

  const [decks, setDecks] = useState<(DeckInterface & { key?: string })[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const [modalMyDeckIsOpen, setMyDeckIsOpen] = React.useState(false);
  const [modalEnemyDeckIsOpen, setEnemyDeckIsOpen] = React.useState(false);
  const [myDeckImage, setMyDeckImage] = React.useState("");
  const [enemyDeckImage, setEnemyDeckImage] = React.useState("");

  const openMyDeckModal = () => {
    setMyDeckIsOpen(true);
  };

  const closeMyDeckModal = () => {
    setMyDeckIsOpen(false);
  };

  const openEnemyDeckModal = () => {
    setEnemyDeckIsOpen(true);
  };

  const closeEnemyDeckModal = () => {
    setEnemyDeckIsOpen(false);
  };

  const myDeckChoice = (deck: DeckInterface) => {
    const card = cards.find((c) => Number(c.id) === deck.HeroCardId);
    if (card) {
      setMyDeckImage(card.image);
      closeMyDeckModal();
    }
  };

  const EnemyDeckChoice = (deck: DeckInterface) => {
    const card = cards.find((c) => Number(c.id) === deck.HeroCardId);
    if (card) {
      setEnemyDeckImage(card.image);
      closeEnemyDeckModal();
    }
  };

  const getDeckCardImage = (deck: DeckInterface) => {
    const card = cards.find((c) => Number(c.id) === deck.HeroCardId);
    return card ? card.image : "";
  };

  Modal.setAppElement("#root");

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
          <h3 className="panel-title">ゲーム準備</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">Card List</Link>
          </h4>
          <div className="row">
            <div className="col-sm-6">
              <div className="card mb-3">
                <div className="card-header">自分のデッキ</div>
                <div className="row no-gutters">
                  <div className="col-md-7">
                    <div className="card-body">
                      <h5 className="card-title">デッキ選択</h5>
                      <button
                        onClick={openMyDeckModal}
                        className="btn btn-info"
                      >
                        選択
                      </button>
                      <Modal
                        isOpen={modalMyDeckIsOpen}
                        onRequestClose={closeMyDeckModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                      >
                        <h4>デッキ一覧</h4>
                        <ListGroup>
                          {/* 本当はindexは良くないけどry */}
                          {decks.map((deck, index) => (
                            <ListGroupItem
                              action
                              onClick={() => myDeckChoice(deck)}
                              className="border-warning"
                              key={index}
                            >
                              <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1"> {deck.deckName}</h5>
                              </div>
                              {getDeckCardImage(deck) ? (
                                <img
                                  src={getDeckCardImage(deck)}
                                  className="deck-image"
                                  alt="..."
                                />
                              ) : (
                                <small>主人公未設定</small>
                              )}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                        <button
                          onClick={closeMyDeckModal}
                          className="btn btn-secondary"
                        >
                          閉じる
                        </button>
                      </Modal>
                    </div>
                  </div>
                  <div className="col-md-5">
                    {myDeckImage ? (
                      <img src={myDeckImage} className="card-img" alt="..." />
                    ) : (
                      <svg
                        className="bd-placeholder-img card-img"
                        width="100%"
                        height="261.19"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                        role="img"
                        aria-label="Placeholder: カードの画像"
                      >
                        <rect fill="#868e96" width="100%" height="100%"></rect>
                        <text fill="#dee2e6" dy=".3em" x="40%" y="50%">
                          未選択
                        </text>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="card mb-3">
                <div className="card-header">相手のデッキ</div>
                <div className="row no-gutters">
                  <div className="col-md-7">
                    <div className="card-body">
                      <h5 className="card-title">デッキ選択</h5>
                      <button
                        onClick={openEnemyDeckModal}
                        className="btn btn-info"
                      >
                        選択
                      </button>
                      <Modal
                        isOpen={modalEnemyDeckIsOpen}
                        onRequestClose={closeEnemyDeckModal}
                        style={customStyles}
                        contentLabel="Example Modal"
                      >
                        <h4>デッキ一覧</h4>
                        <ListGroup>
                          {decks.map((deck, index) => (
                            <ListGroupItem
                              action
                              onClick={() => EnemyDeckChoice(deck)}
                              className="border-warning"
                              key={index}
                            >
                              <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1"> {deck.deckName}</h5>
                              </div>
                              {getDeckCardImage(deck) ? (
                                <img
                                  src={getDeckCardImage(deck)}
                                  className="deck-image"
                                  alt="..."
                                />
                              ) : (
                                <small>主人公未設定</small>
                              )}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                        <button
                          onClick={closeEnemyDeckModal}
                          className="btn btn-secondary"
                        >
                          閉じる
                        </button>
                      </Modal>
                    </div>
                  </div>
                  <div className="col-md-5">
                    {enemyDeckImage ? (
                      <img
                        src={enemyDeckImage}
                        className="card-img"
                        alt="..."
                      />
                    ) : (
                      <svg
                        className="bd-placeholder-img card-img-top"
                        width="100%"
                        height="261.19"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid slice"
                        focusable="false"
                        role="img"
                        aria-label="Placeholder: カードの画像"
                      >
                        <rect fill="#868e96" width="100%" height="100%"></rect>
                        <text fill="#dee2e6" dy=".3em" x="40%" y="50%">
                          未選択
                        </text>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link
            to={{
              pathname: `/game/prepare`,
              state: { cards },
            }}
            className="btn btn-warning"
          >
            ゲーム開始
          </Link>
        </div>
      </div>
    </div>
  );
};
