import React from 'react'
import axios from 'axios'

function KillGame() {

    const handleClick1 = () =>{
        axios.get(`/api/killGame`)
        .then(res=>window.location.reload())
        .catch(err=>console.log(err))
    }


  return (
    <div>
        <button
            onClick={handleClick1}
            >End current game
        </button>
    </div>
  )
}

export default KillGame