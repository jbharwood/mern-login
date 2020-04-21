import React, {useContext} from 'react';
import {Route,Redirect} from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

// what a user that isn't authenticated sees
const UnPrivateRoute = ({component : Component, handleLogin, ...rest})=>{
  const { isAuthenticated } = useContext(AuthContext);
  return(
    <Route {...rest} render={props =>{
      if(isAuthenticated)
        return <Redirect to={{ pathname: '/', state : {from : props.location}}}/>

      return <Component {...props} handleLogin={handleLogin}/>
    }}/>
  )
}

export default UnPrivateRoute;
