import axios from 'axios'
import React, { useState } from 'react'
import Game from './Game'





function Lobby(props) {

  const [display1,setDisplay1]=useState(true)
  const [display2,setDisplay2]=useState(false)


  const handleClick1 = () =>{
    setDisplay1(false)
    setDisplay2(true)
    const body = {
      nickname: props.nickname
    }
    axios.post(`/api/startNew`,body)
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err))
  }

  const handleClick2 = () =>{
        setDisplay2(true)
        setDisplay1(false)

    }




  return (
    
    <>

    
    <div>
    {display1 &&  
      <div>
      <h1>Welcome, {props.nickname+"!"}</h1>
      <div>
        {!props.adminStatus &&
        <button
        onClick={handleClick1}
        >Start new game</button>}
        {props.adminStatus &&<button
        onClick={handleClick2}
        >Join game</button>}
      </div>
      </div>}
      {display2 && <Game nickname={props.nickname} admin={props.adminName}/>}
    </div>

    
    
    </>
  )
}

export default Lobby