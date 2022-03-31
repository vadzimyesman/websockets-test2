
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CardWithWord from './CardWithWord'
import { w3cwebsocket as W3CWebSocket } from "websocket";
//const  HOST = window.location.origin.replace(/^http/, 'ws')

//const client = new W3CWebSocket(HOST);
const client = new W3CWebSocket(`ws://127.0.0.1:4000`);


function CardsSet(props) {


    const [randomWords, setRandomWords]=useState([])
    const [blue, setBlue] = useState([])
    const [red, setRed] = useState([])
    const [grey,setGrey] = useState([])

    const [black, setBlack] = useState("")
    const [ufRan, setufRan] = useState(true)
    
    const showCards = () =>{
      axios.get(`/api/showCards`)
      .then(res=>{
        console.log(res.data)
        setRandomWords(res.data.words)
        setBlue(res.data.blue)
        setRed(res.data.red)
        setGrey(res.data.grey)
        setBlack(res.data.black)
      })
    }


    useEffect(()=>{
      console.log("Initial use effect ran in cards")
      showCards()

    },[])

  useEffect(()=>{
    
      console.log("Use effect with sockets ran in cards")
      client.onopen = () =>{
          console.log('WebSocket Client Connected');
      }
      client.onmessage = (message) => {
          const dataFromServer = JSON.parse(message.data);
          console.log('got reply! ', dataFromServer);
          if (dataFromServer.type==="newCards") {
            setufRan(false)
              showCards()
          }
          
        };
  },[])
    

    const handleClick1 = () =>{



        axios.get(`https://random-word-api.herokuapp.com/word?number=25`)
        .then(res=>{
          console.log(res.data)
          setRandomWords(res.data)
              axios.post(`/api/newWords`,res.data )
              .then(res=>{
                console.log(res.data)
                setBlue(res.data.blue)
                setRed(res.data.red)
                setGrey(res.data.grey)
                setBlack(res.data.black)
                    client.send(JSON.stringify({
                      type: "newCards",
                      msg: "Admin updated cards!",
                      user: props.nickname
                    }));
              })
              .catch(err=>console.log(err))
        })
      }


  return (
      <>
    {props.nickname===props.admin &&<div>
        <button
        onClick={handleClick1}
        >Get random words</button>
    </div>}
    <div className='divWithCards'>
        {randomWords.map((element,index)=>{

            if(red.includes(index)){
              return < CardWithWord key={index} randomWord={element} color={props.spyStatus ? "red":"burlywood"}/>
            } 
            if(blue.includes(index)){
              return < CardWithWord key={index} randomWord={element} color={props.spyStatus ? "blue":"burlywood"}/>
            } 
            if(grey.includes(index)){
              return < CardWithWord key={index} randomWord={element} color={props.spyStatus ? "grey":"burlywood"}/>
            } 
            if(black===index){
              return < CardWithWord key={index} randomWord={element} color={props.spyStatus ? "black":"burlywood"}/>
            } 
        
        })}
    </div>
      </>

  )
}

export default CardsSet

