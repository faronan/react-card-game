import React, { useState } from "react";
import firebase from "../../Firebase";
import { Link, useHistory, useLocation } from "react-router-dom";
import { rangeList, CardRange } from "../../interface/CardInterface";
import {
  CardInterface,
  cardColors,
  supportEffects,
  cardtags,
} from "../../interface/CardInterface";
import "../../css/style.css";

export const Edit = () => {
  const history = useHistory();
  const location = useLocation();
  interface state {
    card: CardInterface;
    key: string;
  }
  const state = location.state as state;
  const key = state["key"];

  const [card, setCard] = useState<CardInterface>(state["card"]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = (() => {
      if (name === "tags") {
        const selectTag: string = e.target.value;
        if (card.tags.includes(selectTag)) {
          return card.tags.filter((c) => c !== selectTag);
        } else {
          card.tags.push(selectTag);
          return card.tags;
        }
      }
      if (name === "range") {
        const mockCardRange = card.range || [];
        const selectRange = Number(e.target.value) as CardRange;
        if (mockCardRange.includes(selectRange)) {
          return card.range.filter((c) => c !== selectRange);
        } else {
          if (card.range) {
            card.range.push(selectRange);
            return card.range;
          }
          return [selectRange];
        }
      }
      return e.target.value;
    })();
    const updateCard = { ...card, [name]: value };
    setCard(updateCard);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    firebase
      .firestore()
      .collection("cards")
      .doc(key)
      .set(card)
      .then((a) => {
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

  const rangeCheckboxList = (card: CardInterface) => {
    const mockCardRange = card.range || [];
    return (
      <ul>
        {rangeList.sort().map((range, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="range"
              value={range}
              onChange={onChange}
              checked={mockCardRange.includes(range as CardRange)}
            />
            {range}
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

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">カード編集</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">カード一覧</Link>
          </h4>
          <button className="btn btn-danger" onClick={back}>
            戻る
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
                <img src={`${card.image}`} alt="" className="show-card-image" />
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
              <label htmlFor="tags" className="col-sm-2 col-form-label">
                射程<span style={{ color: "red" }}>(複数選択可)</span>:
              </label>
              <div className="col-sm-0">{rangeCheckboxList(card)}</div>
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
              保存
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
