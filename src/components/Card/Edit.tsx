/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import firebase from "../../Firebase";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  CardInterface,
  cardColors,
  supportEffects,
  cardtags,
} from "../../interface/CardInterface";
import "../../css/style.css";

export const Edit = () => {
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!card) {
      return;
    }
    const name = e.target.name;
    const value = (() => {
      if (name !== "tags") {
        return e.target.value;
      } else {
        const selectTag: string = e.target.value;
        if (card.tags.includes(selectTag)) {
          return card.tags.filter((c) => c !== selectTag);
        } else {
          card.tags.push(selectTag);
          return card.tags;
        }
      }
    })();
    const updateCard = { ...card, [name]: value };
    setCard(updateCard);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!card) {
      return;
    }
    e.preventDefault();
    firebase
      .firestore()
      .collection("cards")
      .doc(id)
      .set(card)
      .then((a) => {
        setCard(null);
        history.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const colorCheckboxList = (card: CardInterface) => {
    return (
      <ul>
        {Object.values(cardColors).map((color, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="color"
              value={color}
              onChange={onChange}
              checked={color === card.color}
            />
            {color}
          </label>
        ))}
      </ul>
    );
  };

  const supportCheckboxList = (card: CardInterface) => {
    return (
      <ul>
        {Object.values(supportEffects).map((effect, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="support_effect"
              value={effect}
              onChange={onChange}
              checked={effect === card.support_effect}
            />
            {effect}
          </label>
        ))}
      </ul>
    );
  };

  const tagsCheckboxList = (card: CardInterface) => {
    return (
      <ul>
        {Object.values(cardtags).map((tag, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="tags"
              value={tag}
              onChange={onChange}
              checked={card.tags.includes(tag)}
            />
            {tag}
          </label>
        ))}
      </ul>
    );
  };

  const back = () => {
    history.goBack();
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
          <h3 className="panel-title">EDIT CARD</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">CARD List</Link>
          </h4>
          <button className="btn btn-danger" onClick={back}>
            Back
          </button>
          <form onSubmit={onSubmit}>
            <div className="form-group row">
              <label htmlFor="id" className="col-sm-2 col-form-label">
                ID:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="id"
                  value={card.id}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="image" className="col-sm-2 col-form-label">
                画像URL:
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  name="image"
                  value={card.image}
                  onChange={onChange}
                />
              </div>
              <div className="col-sm-2">
                <img src={`${card.image}`} alt="" />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="color" className="col-sm-2 col-form-label">
                色<span style={{ color: "red" }}>(必須)</span>:
              </label>
              <div className="col-sm-0">{colorCheckboxList(card)}</div>
            </div>
            <div className="form-group row">
              <label htmlFor="char_name" className="col-sm-2 col-form-label">
                キャラクター名:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  name="char_name"
                  value={card.char_name}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="cost" className="col-sm-2 col-form-label">
                コスト:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="cost"
                  value={card.cost}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="over_cost" className="col-sm-2 col-form-label">
                CCコスト:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="over_cost"
                  value={card.over_cost ? card.over_cost : "無し"}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label htmlFor="power" className="col-sm-2 col-form-label">
                戦闘力:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="power"
                  value={card.power}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="support_power"
                className="col-sm-2 col-form-label"
              >
                支援:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="support_power"
                  value={card.support_power}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="support_effect"
                className="col-sm-2 col-form-label"
              >
                支援効果<span style={{ color: "red" }}>(必須)</span>:
              </label>
              <div className="col-sm-0">{supportCheckboxList(card)}</div>
            </div>
            <div className="form-group row">
              <label htmlFor="tags" className="col-sm-2 col-form-label">
                タグ<span style={{ color: "red" }}>(複数選択可)</span>:
              </label>
              <div className="col-sm-0">{tagsCheckboxList(card)}</div>
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
