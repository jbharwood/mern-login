import React, {useState,useContext} from 'react';
import AuthService from '../Services/AuthService';
import Message from '../Components/Message';
import {AuthContext} from '../Context/AuthContext';
import {Context} from '../Context/Store'

const Login = props => {
  const [user,setUser] = useState({username: "", password : "", _id: ""});
  const [message,setMessage] = useState(null);
  const authContext = useContext(AuthContext);
  const [globalState, dispatch] = useContext(Context);

  const onChange = e => {
    setUser({...user,[e.target.name] : e.target.value});
  }

// logs users in, navigates to the main page and sets the jwt token to local storage
  const onSubmit = e => {
    e.preventDefault();
    AuthService.login(user).then(data=>{
      console.log("this is data",data);
      const { isAuthenticated,user,message} = data;
      if(isAuthenticated){
        authContext.setUser(user);
        authContext.setIsAuthenticated(isAuthenticated);
        dispatch({type: 'SET_USER', payload: user})
        localStorage.setItem('jwt', data.token)
        props.handleLogin(user)
        props.history.push('/documents');
      }
      else
        setMessage(message);
    });
  }

  return(
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please sign in</h3>
        <label htmlFor="username" className="sr-only">Username: </label>
        <input type="text"
               name="username"
               onChange={onChange}
               className="form-control"
               placeholder="Enter Email"/>
        <label htmlFor="password" className="sr-only">Password: </label>
        <input type="password"
           name="password"
           onChange={onChange}
           className="form-control"
           placeholder="Enter Password"/>
        <button className="btn btn-lg btn-primary btn-block"
          type="submit">Log in </button>
      </form>
      {message ? <Message message={message}/> : null}
    </div>
  )
}

export default Login;
