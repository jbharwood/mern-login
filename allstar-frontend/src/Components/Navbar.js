import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import AuthService from '../Services/AuthService';
import { AuthContext } from '../Context/AuthContext';
import {Context} from '../Context/Store'

const Navbar = props => {
  const {isAuthenticated,user,setIsAuthenticated,setUser} = useContext(AuthContext);
  const [globalState, dispatch] = useContext(Context);

// logout and clears local storage
  const onClickLogoutHandler = ()=>{
    AuthService.logout().then(data=>{
      if(data.success){
        localStorage.clear()
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  }

  const unauthenticatedNavBar = ()=>{
    return (
      <>
        <Link to="/">
          <li className="nav-item nav-link">
            Home
          </li>
        </Link>
        <Link to="/login">
          <li className="nav-item nav-link">
            Login
          </li>
        </Link>
        <Link to="/register">
          <li className="nav-item nav-link">
            Register
          </li>
        </Link>
      </>
    )
  }

  const authenticatedNavBar = ()=>{
    return(
      <>
        <Link to="/">
          <li className="nav-item nav-link">
            Home
          </li>
        </Link>
        {
          user.role === "admin" ?
          <Link to="/documents">
            <li className="nav-item nav-link">
              Users
            </li>
          </Link> :
          <Link to="/documents">
            <li className="nav-item nav-link">
              Documents
            </li>
          </Link>
        }
        <button type="button"
                className="btn btn-link nav-item nav-link"
                onClick={onClickLogoutHandler}>Logout</button>
      </>
  )
  }

  return(
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/">
        <div className="navbar-brand">Allstar</div>
      </Link>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav mr-auto">
          { !isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;
