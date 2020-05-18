import React, { useState, useEffect } from "react";
import firebase from "../Firebase";
import Pagination from "react-js-pagination";
import { Link } from "react-router-dom";
import { CardInterface } from "../interface/CardInterface";
import "../css/style.css";

export const Home = () => {
  const LIMIT = 10;
  const [cards, setCards] = useState<(CardInterface & { key: string })[]>([]);
  const [page, setPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const formatRange = (range: number[]) => {
    if (range && range.length > 1) {
      return `${Math.min(...range)}-${Math.max(...range)}`;
    }
    return range;
  };

  useEffect(() => {
    (async () => {
      firebase
        .firestore()
        .collection("cards")
        .get()
        .then((querySnapshot) => {
          const cards = querySnapshot.docs.map((doc) => {
            const data = doc.data() as CardInterface;
            return { ...data, key: doc.id };
          });
          cards.sort((a: CardInterface, b: CardInterface) => {
            return a.id - b.id;
          });
          setCards(cards);
        });
    })();
  }, []);

  return cards.length === 0 ? (
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
          <h3 className="panel-title">カード一覧</h3>
        </div>
        <div className="panel-body">
          <h4>
            <Link to="/create" className="btn btn-primary">
              カード作成
            </Link>
            <Link
              to={{
                pathname: `/deck`,
                state: { cards },
              }}
              className="btn btn-success"
            >
              デッキ一覧
            </Link>
            <Link
              to={{
                pathname: `/game/prepare`,
                state: { cards },
              }}
              className="btn btn-warning"
            >
              ゲーム準備
            </Link>
          </h4>

          <div className="text-center">
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
                <th>射程</th>
                <th>支援</th>
                <th>支援効果</th>
                <th>タグ</th>
              </tr>
            </thead>
            <tbody>
              {cards.slice((page - 1) * LIMIT, page * LIMIT).map((card) => (
                <tr key={card.id}>
                  <td>
                    <Link
                      to={{
                        pathname: `/show`,
                        state: { card, key: card.key },
                      }}
                    >
                      {card.id}
                    </Link>
                  </td>
                  <td>
                    <img src={`${card.image}`} alt="" className="list-image" />
                  </td>
                  <td>{card.color}</td>
                  <td>{card.char_name}</td>
                  <td>{card.cost}</td>
                  <td>{card.over_cost}</td>
                  <td>{card.power}</td>
                  <td>{formatRange(card.range)}</td>
                  <td>{card.support_power}</td>
                  <td>{card.support_effect}</td>
                  <td>{card.tags.join("\n")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center">
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
        </div>
      </div>
    </div>
  );
};
