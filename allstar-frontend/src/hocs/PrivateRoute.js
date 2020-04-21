import React, {useContext} from 'react';
import {Route,Redirect} from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

// what a user that is authenticated sees
const PrivateRoute = ({component : Component, roles, createDocument, users,
  filterUsers, filterDates, fetchUsers, editDocument, deleteDocument, ...rest})=>{
  const { isAuthenticated, user} = useContext(AuthContext);
  return(
    <Route {...rest} render={props =>{
      if(!isAuthenticated)
        return <Redirect to={{ pathname: '/login', state : {from : props.location}}}/>

      if(!roles.includes(user.role))
          return <Redirect to={{ pathname: '/', state : {from : props.location}}}/>
      return <Component {...props} createDocument={createDocument} users={users}
        filterUsers={filterUsers} filterDates={filterDates} fetchUsers={fetchUsers}
        editDocument={editDocument} deleteDocument={deleteDocument}/>
    }}/>
  )
}

export default PrivateRoute;
