import React, {useState,useContext,useEffect} from 'react';
import User from "./User.js";
import API_URL from '../config.js'
import CreateDoc from "./CreateDoc.js";
import Search from "./Search.js";
import {AuthContext} from '../Context/AuthContext'
import {Context} from '../Context/Store'

const Users = props => {

  const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
  const [globalState, dispatch] = useContext(Context);

// doesn't render admins because they can't do crud operations (yet)
  const renderUsers = () => {
    return props.users.map(user => {
      if (user.role === "user") {
        return <User user={user} editDocument={props.editDocument} deleteDocument={props.deleteDocument}/>
      }
    })
  }

// only admins get the search tools
  const renderFilters = () => {
    if (user.role === "admin") {
      return <Search filterUsers={props.filterUsers} filterDates={props.filterDates}
            fetchUsers={props.fetchUsers} />
    } else {
      return <CreateDoc createDocument={props.createDocument} />
    }
  }

  return (
    <article className="users">
      {renderFilters()}
      {renderUsers()}
    </article>
  )
}
export default Users
