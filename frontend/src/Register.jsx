import React from 'react'
import './Register.css'  
function Register() {
  return (
    <div>
        <h1>Registration</h1>
        <form action="" id='form'>

            <input  id='input' type="text" placeholder="Username" /><br />
            <input  id='input' type="email" placeholder="Email" /><br />
            <input id='input' type="password" placeholder="password" /><br />
            <button id='button'>Sign up</button>
        </form>
    </div>
  )
}

export default Register