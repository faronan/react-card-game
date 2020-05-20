import React from "react";
import Slider from "react-slick";
import Card from "./Card";
import { hooksContexts } from "../Game";
import "../../../css/gameStyle.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Evacuation = (props: { isEnemy: boolean }) => {
  const gameManager = React.useContext(hooksContexts);
  const evacuationCard = gameManager.getEvacuation(props.isEnemy);
  //const card = evacuationCard[0];
  const ArrowLeft = (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLButtonElement> &
      React.ButtonHTMLAttributes<HTMLButtonElement>
  ) => <button {...props} style={{ left: "-10%", zIndex: 1 }} />;

  const ArrowRight = (
    props: JSX.IntrinsicAttributes &
      React.ClassAttributes<HTMLButtonElement> &
      React.ButtonHTMLAttributes<HTMLButtonElement>
  ) => <button {...props} style={{ right: "-10%" }} />;

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
  };

  const cards = (
    <Slider {...settings}>
      {evacuationCard.map((card) => (
        <Card card={card} key={`${card.cardData.id}-${card.id}`}></Card>
      ))}
    </Slider>
  );

  return cards;
};

Evacuation.defaultProps = { isEnemy: false };
export default Evacuation;
