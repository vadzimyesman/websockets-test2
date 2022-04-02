
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CardWithWord from './CardWithWord'
import { w3cwebsocket as W3CWebSocket } from "websocket";

const  HOST = window.location.origin.replace(/^http/, 'ws')
const client = new W3CWebSocket(HOST);

//const client = new W3CWebSocket(`ws://127.0.0.1:4000`);

function CardsSet(props) {

  
    const [randomWords, setRandomWords]=useState([])
    const [blue, setBlue] = useState([])
    const [red, setRed] = useState([])
    const [grey,setGrey] = useState([])

    const [black, setBlack] = useState("")
    const [ufRan, setufRan] = useState(true)
    const [array,setArray] = useState([])
    
    const showCards = () =>{
      axios.get(`/api/showCards`)
      .then(res=>{
        console.log(res.data)
        setRandomWords(res.data.words)
        setBlue(res.data.blue)
        setRed(res.data.red)
        setGrey(res.data.grey)
        setBlack(res.data.black)
        setArray(res.data.open)
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
          if (dataFromServer.type==="cardClick") {
            console.log(`Component  recieved a message about ${dataFromServer.index}`)
            setArray([...array,dataFromServer.index])
            //buttonCliked()
          }
          
        };
  },[])
    

    const handleClick1 =  () =>{



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
                  message: "Admin got new cards!",
                  nickname: "Game"
                }));
              })
              .catch(err=>console.log(err))
        })
        let body={
          message: "Admin got new words",
          nickname: "Game"
        }
        axios.post("/api/post", body)
        //[ { message_id: 1, message: '123', nickname: '1' } ]
        .then(res=>{
          console.log(res.data)
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
              return < CardWithWord  array={array} client={client} index={index} key={index} randomWord={element}
               color={props.spyStatus ? "red":"burlywood" } color1={"red"} nickname={props.nickname} spy={props.spyStatus} />
            } 
            if(blue.includes(index)){
              return < CardWithWord  array={array} client={client} index={index} key={index} randomWord={element}
               color={props.spyStatus ? "blue":"burlywood"} color1={"blue"} nickname={props.nickname} spy={props.spyStatus} />
            } 
            if(grey.includes(index)){
              return < CardWithWord array={array} client={client} index={index}  key={index} randomWord={element}
               color={props.spyStatus ? "grey":"burlywood"} color1={"grey"} nickname={props.nickname} spy={props.spyStatus} />
            } 
            if(black===index){
              return < CardWithWord array={array} client={client} index={index} key={index} randomWord={element}
               color={props.spyStatus ? "black":"burlywood"} color1={"black"} nickname={props.nickname} spy={props.spyStatus} />
            } 
        
        })}
    </div>
      </>

  )
}

export default CardsSet

