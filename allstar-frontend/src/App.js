import React, {useState,useContext,useEffect} from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Home from './Components/Home';
import Register from './Components/Register';
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import API_URL from './config.js'
import CreateDoc from "./Components/CreateDoc.js";
import Users from "./Components/Users.js";
import Docs from "./Components/Docs.js";
import {Context} from './Context/Store'
import {AuthContext} from './Context/AuthContext'

const App = props => {

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([])
  const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
  const [globalState, dispatch] = useContext(Context);

// gets all users and sets the users state. takes in a user for when someone
// logs in and the user state hasn't been set yet
  const fetchUsers = (loggedInUser) => {
    setIsLoading(true)
    fetch(`${API_URL}/users`)
    .then(res => res.json())
    .then(r => {
      let currentUser
      if (!!loggedInUser) {
        currentUser = loggedInUser
      } else {
        currentUser = user
      }
      let users = r
      if (currentUser.role === "user") {
        users = users.filter(u => {
          return currentUser.username == u.username
        })
      }
      setUsers(users)
      setAllUsers(users)
      setIsLoading(false)
    })
  }

// creates document
  const createDocument = doc => {
    fetch(`${API_URL}/users/add`, {
      method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accepts": "application/json",
			},
      body: JSON.stringify(doc)
    }).then(res => res.json())
    .then(r => {
      fetchUsers()
    })
  }

// edits the document
  const editDocument = (doc, docID) => {
    fetch(`${API_URL}/users/documents/${docID}/edit`, {
      method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Accepts": "application/json",
			},
      body: JSON.stringify(doc)
    }).then(res => res.json())
    .then(r => {
      fetchUsers()
    })
  }

//deletes the document
  const deleteDocument = (docID) => {
    fetch(`user/documents/${docID}/delete`, {
      method: "DELETE"
    }).then(res => res.json())
    .then(r => {
      fetchUsers()
    })
  }

// filters users and documents for the note search. documents are nested in users
  const filterUsers = (input) => {
    if (input !== "") {
      let arr = []
      allUsers.forEach(user => {
        let docs = []
        user.docs.forEach(doc => {
          if (doc.note.toLowerCase().includes(input) === true) {
            docs.push(doc)
          }
        })
        if (docs.length > 0) {
          user.docs = docs
          arr.push(user)
        }
      })
      setUsers(arr)
    } else {
      fetchUsers()
    }
  }

// filters usets and documents by date. documents are nested in users
  const filterDates = (input) => {
    const start = new Date(input.start_time) // formated_Date - SDK returned date
    const finish = new Date(input.finish_time)
    const startTimestamp = input.start_time
    const finishTimestamp = input.finish_time
    let arr = []
    allUsers.forEach(user => {
      let docs = []
      user.docs.forEach(doc => {
        const startDate = new Date(doc.start_time)
        const finishDate = new Date(doc.finish_time)
        if (start <= startDate && finish >= finishDate) {
          docs.push(doc)
        }
      })
      if (docs.length > 0) {
        user.docs = docs
        arr.push(user)
      }
    })
    setUsers(arr)
  }

// handles login and passes in the user for their documents to get fetched
  const handleLogin = (user) => {
    fetchUsers(user)
  }

  useEffect(()=>{
    fetchUsers()

// autologin so that a refresh won't lose track of the user and their id
		const jwt = localStorage.getItem('jwt')
		if (jwt) {
      let pass = {user: user, jwt: jwt}
        fetch(`users/auto_login`, {
          method: "POST",
    			headers: {
    				"Content-Type": "application/json",
    				"Accepts": "application/json",
            "Authorization": pass
    			},
          body: JSON.stringify(user)
        }).then(res => res.json())
        .then(r => {
          dispatch({type: "SET_USER", payload: r.user[0]})
        })
		}
  },[]);

  return (
    <div className="container">
      <Router>
        <Navbar/>
        <Route exact path="/" component={Home}/>
        <UnPrivateRoute path="/login" handleLogin={handleLogin} component={Login}/>
        <UnPrivateRoute path="/register" component={Register}/>
        <PrivateRoute path="/documents" roles={["user","admin"]} component={Users}
          createDocument={createDocument} users={users} filterUsers={filterUsers}
          filterDates={filterDates} fetchUsers={fetchUsers} editDocument={editDocument}
          deleteDocument={deleteDocument} />
      </Router>
    </div>
  );
}

export default App;
