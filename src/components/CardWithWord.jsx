import axios from 'axios'
import React, { useState, useEffect } from 'react'





function CardWithWord(props) {
  console.log(`Player's color is red?:${props.red}, Is it reds turn?:${props.redTurn}`)

  const [buttonColor, setButtonColor] = useState(props.color)
  const [buttonContent, setButtonContent] = useState(props.randomWord)
  //const [maxClicks, setMaxClicks] = useState(null)
  
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


// useEffect(()=>{
//   axios.get("api/showClue")
//   .then(res=>{
//     console.log(res.data)
//   })
//   .catch(err=>console.log(err))
// },[])

  const handleClick = ()=> {
    buttonCliked()
    props.client.send(JSON.stringify({
      index: props.index,
      type: "cardClick",
      message: `${props.nickname} clicked on the ${props.randomWord}`,
      nickname: "Game",
      color: props.color1
    }));
    let body1={
      message: `${props.nickname} clicked on the ${props.randomWord}`,
      nickname: "Game"
    }
    axios.post("/api/post", body1)
    //[ { message_id: 1, message: '123', nickname: '1' } ]
    .then(res=>{
      console.log(res.data)
    })
    .catch(err=>console.log(err))
    axios.put(`/api/addOpening/${props.index}`)
    //[ { message_id: 1, message: '123', nickname: '1' } ]
    .then(res=>{
      console.log(res.data)
    .catch(err=>console.log(err))
    })
  }


  return (
    <>
    {!props.spy&&props.red===props.redTurn&&!props.spyTurn ?
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
          
          :
          
          <div
          className='article'
          style={{backgroundColor: `${props.color}`}}
          >
            <div
                  className='wordCard'
                  style={{color: `white`, backgroundColor: `${buttonColor}`}}    
            >
              <h1 style={{fontSize:`${260/props.randomWord.length}px`}}>{buttonContent}</h1>
            </div>
          </div>  
          } 
    </>
  )
}

export default CardWithWord