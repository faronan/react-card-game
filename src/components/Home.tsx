/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component, useState } from "react";
import firebase from "../Firebase";
import { Link } from "react-router-dom";
import { CardInterface } from "../interface/CardInterface";

export const Home = () => {
  const [cards, setCards] = useState<CardInterface[]>([]);
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
                <th>CharName</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr>
                  <td>
                    <Link to={`/show/${card.id}`}>{card.id}</Link>
                  </td>
                  <td>{card.char_name}</td>
                  <td>{card.image}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
