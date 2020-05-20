import React, { useState } from "react";
import firebase from "../../Firebase";
import { Link, useHistory } from "react-router-dom";
import {
  CardInterface,
  cardColors,
  supportEffects,
  cardtags,
} from "../../interface/CardInterface";
import "../../css/style.css";

export const Create = () => {
  const initialCard: CardInterface = {
    id: 0,
    image: "",
    color: "赤",
    charName: "",
    cost: 0,
    overCost: 0,
    power: 0,
    range: [1],
    supportPower: 0,
    supportEffect: "無し",
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
            name="supportEffect"
            value={effect}
            onChange={onChange}
            checked={effect === card.supportEffect}
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
          <h3 className="panel-title">カード作成</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/">カード一覧</Link>
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
              <label htmlFor="charName" className="col-sm-2 col-form-label">
                キャラクター名:
              </label>
              <div className="col-sm-4">
                <input
                  type="text"
                  className="form-control"
                  name="charName"
                  value={card.charName}
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
              <label htmlFor="overCost" className="col-sm-2 col-form-label">
                CCコスト:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="overCost"
                  value={card.overCost}
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
              <label htmlFor="supportPower" className="col-sm-2 col-form-label">
                支援:
              </label>
              <div className="col-sm-2">
                <input
                  type="number"
                  className="form-control"
                  name="supportPower"
                  value={card.supportPower}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="supportEffect"
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
              作成
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
