import React from "react";
import firebase from "../../Firebase";
import { Link, useHistory, useLocation } from "react-router-dom";
import { CardInterface } from "../../interface/CardInterface";

export const Show = () => {
  const history = useHistory();
  const location = useLocation();
  interface state {
    card: CardInterface;
    key: string;
  }
  const state = location.state as state;
  const card = state["card"];
  const key = state["key"];

  const deleteCard = (id: string) => {
    firebase
      .firestore()
      .collection("cards")
      .doc(id)
      .delete()
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h4>
            <Link to="/">カード一覧</Link>
          </h4>
          <h3 className="panel-title">{card.charName}</h3>
        </div>
        <div className="panel-body">
          <dl>
            {/* <dt>Description:</dt>
            <dd>{card.color}</dd>
            <dt>Author:</dt>
            <dd>{card.color}</dd> */}
            <img src={`${card.image}`} alt="" />
          </dl>
          <Link
            to={{
              pathname: `/edit`,
              state: { card, key },
            }}
            className="btn btn-success"
          >
            編集
          </Link>
          <button onClick={() => deleteCard(key)} className="btn btn-danger">
            削除
          </button>
        </div>
      </div>
    </div>
  );
};
