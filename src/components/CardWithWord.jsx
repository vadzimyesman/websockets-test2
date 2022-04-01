import React, { useState, useEffect } from 'react'
//import cardLogo from './images/card.png'

//const client = new W3CWebSocket(`ws://127.0.0.1:4000`);

function CardWithWord(props) {

  const [buttonColor, setButtonColor] = useState(props.color)
  
  const buttonCliked = ()=>{
    console.log(props.index)
    setButtonColor(props.color1)
  }
  
useEffect(()=>{
  if (props.array.includes(props.index)){
    setButtonColor(props.color1)
  }
},[props.array])


  const handleClick = ()=> {
    buttonCliked()
    props.client.send(JSON.stringify({
      index: props.index,
      type: "cardClick",
      msg: `${props.nickname} clicked on the ${props.randomWord}`,
      user: "Game"
    }));
  }


  return (
    <>
    
    <div 
    
    className='article'
    //style={{backgroundImage: `url(${cardLogo})`}}
    style={{backgroundColor: `${props.color}`}}
    >
      <button
      onClick={handleClick}
      className='wordCard'
      style={{color: `white`, backgroundColor: `${buttonColor}`, fontSize:`${260/props.randomWord.length}px`}}>
      {props.randomWord}
      </button>

    </div>

    </>
  )
}

export default CardWithWord