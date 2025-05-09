import './Header.css';
import { useLocation, Link } from 'react-router-dom';

const Header = () => {

  const location = useLocation();

  return (
    <div className='header-container'>
      <div className="heading">
        <h1>Task Management</h1>
      </div>

      <ul className='menu'>
        {location.pathname === "/register" ?
          <li className='menu-item'>
            <Link to="/login">Login</Link>
          </li>
          :
          <li className="menu-item">
            <Link to="/register">Register</Link>
          </li>}
      </ul>
    </div>
  )
}

export default Header;