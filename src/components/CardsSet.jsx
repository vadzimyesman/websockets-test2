
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CardWithWord from './CardWithWord'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ScoreRed from './ScoreRed';
import ScoreBlue from './ScoreBlue';
import ClueInput from './ClueInput';

const  HOST = window.location.origin.replace(/^http/, 'ws')
const client = new W3CWebSocket(HOST);

// const client = new W3CWebSocket(`ws://127.0.0.1:4000`);

function CardsSet(props) {


    const [randomWords, setRandomWords]=useState([])

    const [blue, setBlue] = useState([])
    const [red, setRed] = useState([])
    const [grey,setGrey] = useState([])
    const [black, setBlack] = useState("")

    const [array,setArray] = useState([])

    const [blueLeft, setBlueLeft] = useState("")
    const [redLeft, setRedLeft] = useState("")

    //WHo's turn it is?
    const [redTurn,setRedTurn]=useState(null)
    const [spyTurn, setSpyTurn]=useState(null)
    const [maxClicks, setMaxClicks] = useState(null)


    useEffect(()=>{
      console.log("Initial use effect ran in cards")
      axios.get(`/api/showCards`)
      .then(res=>{
        console.log(res.data, "USEEFFECT")
        setRandomWords(res.data.words)
        setBlue(res.data.blue)
        setRed(res.data.red)
        setGrey(res.data.grey)
        setBlack(res.data.black)
        setArray(res.data.open)
        setBlueLeft(res.data.blueLeft.length)
        setRedLeft(res.data.redLeft.length)
      })
      axios.get(`/api/showTurn`)
      .then(res=>{
        console.log(res.data.red,res.data.spy)
        setRedTurn(res.data.red)
        setSpyTurn(res.data.spy)
      })
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
            setBlue([])
            setRed([])
            setGrey([])
            setBlack("")
            setBlueLeft([])
            setRedLeft([])
            console.log("New cards should be shown!")
            axios.get(`/api/showCards`)
            .then(res=>{
              console.log(res.data, "USEEFFECT")
              setRandomWords(res.data.words)
              setBlue(res.data.blue)
              setRed(res.data.red)
              setGrey(res.data.grey)
              setBlack(res.data.black)
              setArray(res.data.open)
              setBlueLeft(res.data.blueLeft.length)
              setRedLeft(res.data.redLeft.length)
            })
          }
          if (dataFromServer.type==="cardClick") {
            console.log(`Component  recieved a message about ${dataFromServer.index}`)
            setArray([...array,dataFromServer.index])
            if (dataFromServer.color==="blue"){
              console.log("Blue word was clicked")
              console.log(`${blueLeft.length} blue cards left`)
              setBlueLeft(blueLeft-1)
            }
            if (dataFromServer.color==="red"){
              console.log("Red word was clicked")
              console.log(`${redLeft.length} red cards left`)
              setRedLeft(redLeft-1)
            }
          }
          if (dataFromServer.type==="clue") {
            setMaxClicks(+dataFromServer.message.numberOfWords)
            axios.get(`/api/showTurn`)
            .then(res=>{
              console.log(res.data.red,res.data.spy)
              setRedTurn(res.data.red)
              setSpyTurn(res.data.spy)
            })
          }
          if (dataFromServer.type==="turn") {
            axios.get(`/api/showTurn`)
            .then(res=>{
              console.log(res.data.red,res.data.spy)
              setRedTurn(res.data.red)
              setSpyTurn(res.data.spy)
            })
          }
        };
  },[])
    

    const handleClick1 =  () =>{

      let newWordsArray = []
        for (let i=1; i<=25;i++){

          axios.get(`https://random-word-form.herokuapp.com/random/noun`)
          .then(res=>{
            console.log(res.data[0])
            newWordsArray.push(res.data[0])
            if (i===25){
              setRandomWords(newWordsArray)
              setBlue([])
              setRed([])
              setGrey([])
              setBlack("")
              setBlueLeft([])
              setRedLeft([])
              axios.post(`/api/newWords`, newWordsArray )
              .then(res=>{
                console.log(res.data, "CLICKED")
                setBlue(res.data.blue)
                setRed(res.data.red)
                setGrey(res.data.grey)
                setBlack(res.data.black)
                setBlueLeft(res.data.blueLeft.length)
                setRedLeft(res.data.redLeft.length)
                if(res.data.red.length===9){
                  setRedTurn(true)
                  setSpyTurn(true)
                } else {
                  setRedTurn(false)
                  setSpyTurn(true)
                }
                client.send(JSON.stringify({
                  type: "newCards",
                  message: "Admin got new cards!",
                  nickname: "Game"
                }));
                let body={
                  message: "Admin got new words!",
                  nickname: "Game"
                }
                axios.post("/api/post", body)
                .then(res=>{
                  console.log(res.data)
                })
                .catch(err=>console.log(err))
              })
            }
          })
        }
      }

console.log(redTurn,props.red,spyTurn,props.spyStatus)

  return (
      <>
      <div className='aboveCards'>
          <div className='scoreRed'>
            <ScoreRed  value={redLeft}/>
          </div>
          <div>
          {props.nickname===props.admin &&<div>
            <button
            onClick={handleClick1}
            >Get random words</button>
          </div>}
          {blueLeft===0&&redLeft!==0 && <h4>Blue team has won the game!</h4>}
          {redLeft===0&&blueLeft!==0 && <h4>Red team has won the game!</h4>}
          {blueLeft!==0&&redLeft!==0 && <h4>{redTurn? "Red":"Blue"} &nbsp;{spyTurn? "spy":"agents"}, it is your turn! {!spyTurn &&   `${maxClicks+1} clicks possibly available!`}</h4>}
          </div>
          <div className='scoreBlue'>
            <ScoreBlue  value={blueLeft}/>
          </div>
      </div>
      <div className='divWithCards'>
          {randomWords.map((element,index)=>{

              if(red.includes(index)){
                return < CardWithWord  array={array} client={client} index={index} key={index} randomWord={element} red={props.red} maxClicks={maxClicks} setMaxClicks={setMaxClicks}
                color={props.spyStatus ? "red":"burlywood" } color1={"red"} nickname={props.nickname} spy={props.spyStatus} redTurn={redTurn} spyTurn={spyTurn}/>
              } 
              if(blue.includes(index)){
                return < CardWithWord  array={array} client={client} index={index} key={index} randomWord={element} red={props.red} maxClicks={maxClicks} setMaxClicks={setMaxClicks}
                color={props.spyStatus ? "blue":"burlywood"} color1={"blue"} nickname={props.nickname} spy={props.spyStatus} redTurn={redTurn} spyTurn={spyTurn}/>
              } 
              if(grey.includes(index)){
                return < CardWithWord array={array} client={client} index={index}  key={index} randomWord={element} red={props.red} maxClicks={maxClicks} setMaxClicks={setMaxClicks}
                color={props.spyStatus ? "grey":"burlywood"} color1={"grey"} nickname={props.nickname} spy={props.spyStatus} redTurn={redTurn} spyTurn={spyTurn}/>
              } 
              if(black===index){
                return < CardWithWord array={array} client={client} index={index} key={index} randomWord={element} red={props.red} maxClicks={maxClicks} setMaxClicks={setMaxClicks}
                color={props.spyStatus ? "black":"burlywood"} color1={"black"} nickname={props.nickname} spy={props.spyStatus} redTurn={redTurn} spyTurn={spyTurn}/>
              } 
          
          })}
      </div>
      {(redTurn===props.red&&spyTurn&&props.spyStatus&&blueLeft!==0&&redLeft!==0) && <div>
        <ClueInput nickname={props.nickname} red={props.red}/>
      </div>}
        
      </>

  )
}

export default CardsSet

