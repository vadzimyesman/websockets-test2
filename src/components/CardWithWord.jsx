import axios from 'axios'
import React, { useState, useEffect } from 'react'

//import cardLogo from './images/card.png'

//const client = new W3CWebSocket(`ws://127.0.0.1:4000`);

function CardWithWord(props) {

  const [buttonColor, setButtonColor] = useState(props.color)
  const [buttonContent, setButtonContent] = useState(props.randomWord)
  
  const buttonCliked = ()=>{
    console.log(props.index)
    setButtonColor(props.color1)
  }
  
useEffect(()=>{
  if (props.array.includes(props.index)){
    setButtonColor(props.color1)
      if (props.spy){
        setButtonContent("")
      }
  }
},[props.array])


  const handleClick = ()=> {
    buttonCliked()
    props.client.send(JSON.stringify({
      index: props.index,
      type: "cardClick",
      message: `${props.nickname} clicked on the ${props.randomWord}`,
      nickname: "Game"
    }));
    let body1={
      message: `${props.nickname} clicked on the ${props.randomWord}`,
      nickname: "Game"
    }
    axios.post("/api/post", body1)
    //[ { message_id: 1, message: '123', nickname: '1' } ]
    .then(res=>{
      console.log(res.data)
    .catch(err=>console.log(err))
    })
    let body2={
      message: `${props.nickname} clicked on the ${props.randomWord}`,
      nickname: "Game"
    }
    axios.put(`/api/addOpening/${props.index}`)
    //[ { message_id: 1, message: '123', nickname: '1' } ]
    .then(res=>{
      console.log(res.data)
    .catch(err=>console.log(err))
    })
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
      {buttonContent}
      </button>

    </div>

    </>
  )
}

export default CardWithWord