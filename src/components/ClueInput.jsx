import React from 'react'

function ClueInput() {
  return (
    <div>
        <form className='clueForm'>
            <input
                placeholder='Give a clue'
                >
            </input>
            <select name="choice" defaultValue="one">
                <option value="one" >1</option>
                <option value="two">2</option>
                <option value="three">3</option>
                <option value="four">4</option>
                <option value="five">5</option>
                <option value="six">6</option>
                <option value="seven">7</option>
                <option value="eight" >8</option>
                <option value="infinity">∞</option>
            </select>
            &nbsp;
            <button>give clue</button>
        </form>
 
        
    </div>
  )
}

export default ClueInput