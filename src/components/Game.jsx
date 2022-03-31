import React from 'react'
import ChatTest from './ChatTest'
import Teams from './Teams'

function Game(props) {



    
  return (
    <div >
        <div className='gamePage'>
            <Teams 
            nickname={props.nickname} 
            admin={props.admin==='no admin yet'? props.nickname : props.admin}
            />
            <ChatTest nickname={props.nickname}/>
        </div>

    </div>

  )
}

export default Game