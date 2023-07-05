import React from 'react'
import { signUp, signIn } from '../services/authServices';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  //returns a page with a login form and a register form styled with w3.css
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [idNumber, setIdNumber] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [isLogin, setIsLogin] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    signIn(email, password).then((res) => {
      console.log(res);
      navigate("/join");
    }
    ).catch((err) => {
      console.log(err);
      setLoading(false);
      clearFields();
      alert("Login failed...");
    }
    )
  }

  const handleRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    signUp(email, password, idNumber, username).then((res) => {
      alert("User created successfully");
      setIsLogin(true);
      clearFields();
      setLoading(false);
    }
    ).catch((err) => {
      console.log(err);
      alert("User creation failed");
      setLoading(false);

    }
    )

  }

  const clearFields = () => {
    setUsername("");
    setPassword("");
    setIdNumber("");
    setEmail("");
  }

  return (
    <div className="w3-container" style={{display:'block', justifyContent:'center', alignItems:'center', minWidth:'400px'}}>
      <div className="w3-row">
      <div className="w3-col m6 w3-center">
      <h1>Gebze Technical University Education Portal</h1>
          <div className="w3-padding w3-margin">
            <img src="https://abl.gtu.edu.tr/html/mobil/gtu_logo_tr_500.png" style={{width:'100%'}}></img>
            </div>
        </div>
        {(isLogin)?<div className="w3-col m6 w3-center">
          
          <form className="w3-container w3-card w3-padding w3-margin w3-round-large" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <h2>Login</h2>
            <label>Email</label>
            <input className="w3-input w3-padding w3-margin" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input className="w3-input w3-padding w3-margin" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type='submit' className={`w3-button ${(loading)?'w3-grey':'w3-blue'} w3-padding w3-margin`} disabled={loading} onClick={(e)=>handleLogin(e)}>Login</button>
            <button type='button' className="w3-button w3-white w3-padding w3-margin w3-red w3-text-blue" style={{display:'block'}} onClick={()=>{setIsLogin(!isLogin); clearFields(); }}>Create account instead</button>
          </form>
        </div>:<div className="w3-col m6 w3-center">
          
          <form className="w3-container w3-card w3-padding w3-margin w3-round-large" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
          <h2>Register</h2>
            <label>Username</label>
            <input className="w3-input w3-padding w3-margin" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Password</label>
            <input className="w3-input w3-padding w3-margin" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>ID Number</label>
            <input className="w3-input w3-padding w3-margin" type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            <label>Email</label>
            <input className="w3-input w3-padding w3-margin" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type='submit' className={`w3-button ${(loading)?'w3-grey':'w3-teal'} w3-padding w3-margin`} disabled={loading} onClick={handleRegister}>Register</button>
            <button type='button' className="w3-button w3-white w3-padding w3-margin w3-red w3-text-blue" style={{display:'block'}} onClick={()=>{setIsLogin(!isLogin); clearFields();}}>Login instead</button>
          </form>
        </div>}
      </div>
      
    </div>
  )
  


}

export default AuthPage