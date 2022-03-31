import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MessagePost from './MessagePost'



function Chat(props) {

    const [input1,setInput1]=useState("")
    const [posts, updatePosts]=useState([])
    
    useEffect(()=>{
        tet2()
    }, [])

    const tet2=()=>{
        axios.get(`/api/show`).then(res=>updatePosts(res.data))
    }

    const handleClick1 = () =>{
        setInput1("")
        const body ={
            message: input1,
            nickname: props.nickname
        }
        axios.post(`/api/post`,body)
        .then(res=>{
            console.log(res.data)
            updatePosts(res.data)
        })
        .catch(err=>console.log(err))
    }

    let messagesToDisplay = posts
        .map((element,index)=>{
            return <MessagePost key={index} nickname={element.nickname} message={element.message}/>
        })

  return (
    <div>
        <input
        value={input1}
        placeholder="Type your message"
        onChange={e=>{
            setInput1(e.target.value)
        }}
        ></input>
        <button
        onClick={handleClick1}
        >Send</button>
        <div>
            {messagesToDisplay}
        </div>
    </div>
  )
}

export default Chat