import React from 'react'
import cardLogo from './images/card.png'

function CardWithWord(props) {
  return (
    <>
    
    <div
    
    className='article'
    //style={{backgroundImage: `url(${cardLogo})`}}
    style={{backgroundColor: `${props.color}`}}
    >
      <h2 className='wordCard' style={{color: `white`}}>{props.randomWord}</h2>
    </div>

    </>
  )
}

export default CardWithWord