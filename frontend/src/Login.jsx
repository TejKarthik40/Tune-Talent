import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
 const handleLogin = (e) => {
    e.preventDefault();

    console.log(username);
    console.log(password);
};
  return (
    <div>
      <h2>Login</h2>
<form onSubmit={handleLogin}>
<input type="text" placeholder="Enter Username" value={username} onChange={(e) => setusername(e.target.value)} />
 <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit">  Login</button>
      </form>
    </div>
  );
}

export default Login;