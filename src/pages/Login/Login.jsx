
import './Login.css'
import assets from '../../assets/assets'
import { useState } from 'react'
// import { singup } from './src/config/firebase.js';
import { singup, login, resetPass } from '../../config/firebase';


const Login = () => {

  const [currentState, setcurrentState] = useState("Login");
  // const [currentState, setcurrentState] = useState("Sign up")
  
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event) =>{
    event.preventDefault();
    if(currentState==="Sign up"){
      singup(userName,email,password);
    }
    else{
      login(email,password);
    }
  }



  return (
    <div>
      <div className="login">
        <img src={ assets.logo_big}  className='logo' />
        <form onSubmit={onSubmitHandler} className="login-form">

          {/* <h2>{currentState}</h2> */}
          <h2>{currentState === "Login"?"Welocme back":"Sign Up"}</h2>

          {currentState === "Sign up"?<input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text" placeholder='username' className="form-input" required/>:null} 
          <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" placeholder='Email addres' className="form-input" required/>
          <input onChange={(e)=> setPassword(e.target.value)} value={password} type="password" placeholder='password' className="form-input" required/>
          <button type='submit'>{currentState === "Sign up"?"Create account":"sign in"}</button>
          <div className="login-term">
            <input type="checkbox"  {...(currentState ==="Sign up"?{required:true}:{})}  />
            {currentState === "Sign up"
            ?
            <p>Agree to the terms of use and privacy policy</p>
            :
            <p>Remember me</p>
            }
          </div>
          <div className="login-forgot">
            {currentState ==="Sign up"
            ?
            <p className="login-toggle">Have an account? <span onClick={()=>setcurrentState("Login")}>Login</span></p>
            :
            <p className="login-toggle">Don't have an account? <span onClick={()=>setcurrentState("Sign up")}>Sign up</span></p>

            }
            {currentState == "Login" ? <p className="login-toggle">Forgot Password? LOL<span onClick={()=>resetPass(email)}> BAKAAAA {">_<"}</span></p> : null }
          </div>
        </form>
      </div>

    </div>
  )
}

export default Login