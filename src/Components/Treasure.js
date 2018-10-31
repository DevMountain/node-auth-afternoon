import React from 'react'

export default function Treasure(props) {
    let treasure = props.treasure.map((item, index) => {
        return <img src={item.image_url} key={index} alt=''/>
    })
  return (
    <div >
      {treasure}
    </div>
  )
}
