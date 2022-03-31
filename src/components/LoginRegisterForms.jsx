import React, { useState } from 'react'
import axios from 'axios'
import Lobby from './Lobby'

function LoginRegisterForms() {

    const [input1,setInput1]=useState("")
    const [input2,setInput2]=useState("")
    const [input3,setInput3]=useState("")
    const [input4,setInput4]=useState("")
    const [input5,setInput5]=useState("")
    const [nickname, setNickname]=useState("")
    const [loginFormStatus, setLoginFormStatus]=useState(true)
    const [registerFormStatus, setregisterFormStatus]=useState(false)
    const [lobbyStatus, setLobbyStatus]=useState(false)
    const [loginErrorStatus, setLoginErrorStatus]=useState(false)
    const [nicknameError, setNicknameError]=useState(false)
    const [passwordError, setPasswordError]=useState(false)
    const [adminStatus, setAdminStatus]=useState(false)
    const [adminName, setAdminName]=useState("")

    const handleClick1 = (event) =>{
        
        setInput1("")
        setInput2("")
        event.preventDefault()
        
        const body={
            nickname:input1,
            password:input2
        }
        axios.post(`/api/login`,body)
        .then((res)=>{
            console.log(res.data)
            if (res.data){
                adminExists()
                setLobbyStatus(true)
                setLoginFormStatus(false)
                setNickname(input1)          
            } else {
                setLoginErrorStatus(true)
            }
        })

    }

    const handleClick2 = () =>{
        setLoginFormStatus(false)
        setregisterFormStatus(true)
    }

    const handleClick3 = (event) =>{

        setPasswordError(false)
        event.preventDefault()
        if (input4===input5){
            let body={
                nickname:input3,
                password:input4
            }
            axios.post(`/api/register`,body)
            .then(res=>{
                if (res.data){
                    adminExists()
                    console.log(res.data)
                    setLobbyStatus(true)
                    setregisterFormStatus(false)
                    setNickname(input3)
                } else {
                    setNicknameError(true)
                }
            })

        } else {
            setPasswordError(true)
            setInput4("")
            setInput5("")
        }      
    }

 const adminExists = ()=>{
     axios.get(`/api/adminCheck`)
     .then(res=>{
        console.log(res.data)
        setAdminStatus(res.data.adminExists)
        setAdminName(res.data.adminNickname)
     })
     .catch(err=>console.log(err))
 }

  return (
    <div>
        {loginFormStatus && <form>
            <h3>Existing player?</h3>
            <input
            value={input1}
            onChange={e=>{
                setInput1(e.target.value)
            }}
            placeholder='Nickname:'
            ></input>
            <br/>
            <input
            value={input2}
            onChange={e=>{
                setInput2(e.target.value)
            }}
            placeholder='Password:'
            ></input>
            <button
            onClick={handleClick1}
            >Log in</button>

            {loginErrorStatus && <h3>Wrong nickname or password</h3>}

            <h3>New player?</h3>
            <button
            onClick={handleClick2}
            >Register</button>
            </form>}

            {registerFormStatus &&<form>
            <input
            value={input3}
            placeholder='Nickname'
            onChange={e=>{
                setInput3(e.target.value)
            }}
            >
            </input>
            <input
            value={input4}
            type="password"
            placeholder='Password'
            onChange={e=>{
                setInput4(e.target.value)
            }}
            >
            </input>
            <input
            value={input5}
            type="password"
            placeholder='Confirm password'
            onChange={e=>{
                setInput5(e.target.value)
            }}
            >
            </input>
            <button
            onClick={handleClick3}
            >Submit</button>
            {nicknameError && <h3>Nickname is already taken!</h3>}
            {passwordError && <h3>Passwords did not match!</h3>}
        </form>}

        {lobbyStatus && <Lobby  nickname={nickname} adminName={adminName} adminStatus={adminStatus}/>}
    </div>
  )
}

export default LoginRegisterForms