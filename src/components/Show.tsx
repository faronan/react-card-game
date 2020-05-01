/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import firebase from "../Firebase";
import { Link, useHistory, useParams } from "react-router-dom";
import { CardInterface } from "../interface/CardInterface";
import "../css/style.css";

export const Show = () => {
  const [card, setCard] = useState<CardInterface | null>();
  const history = useHistory();
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      firebase
        .firestore()
        .collection("cards")
        .doc(id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setCard(doc.data() as CardInterface);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, [id]);

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
  return !card || !id ? (
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
          <h4>
            <Link to="/">Card List</Link>
          </h4>
          <h3 className="panel-title">{card.char_name}</h3>
        </div>
        <div className="panel-body">
          <dl>
            {/* <dt>Description:</dt>
            <dd>{card.color}</dd>
            <dt>Author:</dt>
            <dd>{card.color}</dd> */}
            <img src={`${card.image}`} alt="" />
          </dl>
          <Link to={`/edit/${id}`} className="btn btn-success">
            Edit
          </Link>
          <button onClick={() => deleteCard(id)} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
