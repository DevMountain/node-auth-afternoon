import React from 'react';
import AddTreasure from './AddTreasure';

export default function Treasure(props) {
  const treasure = props.treasure.map((item, index) => {
    return <img src={item.image_url} key={index} alt="" />;
  });
  return (
    <div>
      {props.addMyTreasure ? <AddTreasure /> : null}
      {treasure}
    </div>
  );
}
