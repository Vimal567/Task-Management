import { useEffect, useState } from 'react';
import './Header.css';
import { useLocation, Link } from 'react-router-dom';

const Header = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    //Check if already loggedin
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  return (
    <div className='header-container'>
      <div className="heading">
        <h1>Task Management</h1>
      </div>

      <ul className='menu'>
        {!isLoggedIn ? (location.pathname === "/register" ?
          <li className='menu-item'>
            <Link to="/login">Login</Link>
          </li>
          :
          <li className="menu-item">
            <Link to="/register">Register</Link>
          </li>) 
          : 
          <li className='menu-item'>
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </li>}
      </ul>
    </div>
  )
}

export default Header;