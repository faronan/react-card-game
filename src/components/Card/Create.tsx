/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import firebase from "../../Firebase";
import { Link, useHistory } from "react-router-dom";
import {
  CardInterface,
  cardColors,
  supportEffects,
  cardtags,
} from "../../interface/CardInterface";

export const Create = () => {
  const initialCard: CardInterface = {
    id: 0,
    image: "",
    color: "赤",
    char_name: "",
    cost: 0,
    over_cost: 0,
    power: 0,
    support_power: 0,
    support_effect: "無し",
    tags: [],
  };
  const [card, setCard] = useState<CardInterface>(initialCard);
  const history = useHistory();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    e.preventDefault();
    firebase
      .firestore()
      .collection("cards")
      .add(card)
      .then((a) => {
        setCard(initialCard);
        history.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const colorCheckboxList = (
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

  const supportCheckboxList = (
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

  const tagsCheckboxList = (
    <ul>
      {Object.values(cardtags).map((tag, index) => (
        <label key={index}>
          <input type="checkbox" name="tags" value={tag} onChange={onChange} />
          {tag}
        </label>
      ))}
    </ul>
  );

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">ADD CARD</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">CARD List</Link>
          </h4>
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
              <div className="col-sm-0">{colorCheckboxList}</div>
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
              <div className="col-sm-0">{supportCheckboxList}</div>
            </div>
            <div className="form-group row">
              <label htmlFor="tags" className="col-sm-2 col-form-label">
                タグ<span style={{ color: "red" }}>(複数選択可)</span>:
              </label>
              <div className="col-sm-0">{tagsCheckboxList}</div>
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

// const TextForm = (props: {
//   labelText: string;
//   variableName: keyof CardInterface;
// }) => {
//   return (
//     <div className="form-group">
//       <label htmlFor={props.variableName}>{props.labelText}:</label>
//       <input
//         type="text"
//         className="form-control"
//         name={props.variableName}
//         value={card[props.variableName] as string}
//         onChange={onChange}
//       />
//     </div>
//   );
// };
// const NumberForm = (props: {
//   labelText: string;
//   variableName: keyof CardInterface;
// }) => {
//   return (
//     <div className="form-group">
//       <label htmlFor={props.variableName}>{props.labelText}:</label>
//       <input
//         type="number"
//         className="form-control"
//         name={props.variableName}
//         value={card[props.variableName] as number}
//         onChange={onChange}
//       />
//     </div>
//   );
// };
