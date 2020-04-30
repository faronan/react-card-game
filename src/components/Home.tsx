/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component, useState, useEffect } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import { CardInterface } from "../interface/CardInterface";

export const Home = () => {
  const [cards, setCards] = useState<(CardInterface & { key: string })[]>([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("cards")
      .get()
      .then((querySnapshot) => {
        const cards = querySnapshot.docs.map((doc) => {
          const data = doc.data() as CardInterface;
          return { ...data, key: doc.id };
        });
        setCards(cards);
      });
  });

  return (
    <div className="container">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Card List</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/create">Create Card</Link>
          </h4>
          <table className="table table-stripe">
            <thead>
              <tr>
                <th>Id</th>
                <th>画像</th>
                <th>色</th>
                <th>キャラクター名</th>
                <th>コスト</th>
                <th>CCコスト</th>
                <th>戦闘力</th>
                <th>支援</th>
                <th>支援効果</th>
                <th>タグ</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id}>
                  <td>
                    <Link to={`/show/${card.key}`}>{card.id}</Link>
                  </td>
                  <td>
                    <img src={`${card.image}`} alt="" />
                  </td>
                  <td>{card.color}</td>
                  <td>{card.char_name}</td>
                  <td>{card.cost}</td>
                  <td>{card.over_cost}</td>
                  <td>{card.power}</td>
                  <td>{card.support_power}</td>
                  <td>{card.support_effect}</td>
                  <td>{card.tags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
