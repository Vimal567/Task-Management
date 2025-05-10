import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useSnackbar } from 'notistack';
import {
  ENDPOINT,
  REQUIRED_FIELDS,
  LOGIN_FAILED,
  LOGIN_SUCCESS
} from '../../constants/constants';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [userEntry, setUserEntry] = useState({
    email: '',
    password: ''
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEntry(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = userEntry;

    // Check if all required fields are filled
    if (!email || !password) {
      enqueueSnackbar(REQUIRED_FIELDS, { variant: 'warning' });
      return;
    }

    try {
      const response = await axios.post(ENDPOINT + 'auth/login', {
        email,
        password
      });

      const { data, token } = response.data;

      // Save account id and token in localStorage
      if (data) {
        localStorage.setItem('id', data.id);
      }
      if (token) {
        localStorage.setItem('token', token);
      }

      // Clear the form and navigate to task
      setUserEntry({ email: '', password: '' });
      enqueueSnackbar(LOGIN_SUCCESS, { variant: 'success' })
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || LOGIN_FAILED;
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  useEffect(() => {
    //if already loggedin
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);
  

  return (
    <div className="login-section page-container">
      <div className="login-form card">
        <form onSubmit={handleSubmit}>
          <h1>login</h1>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              className='form-control'
              type="email"
              name="email"
              id="email"
              value={userEntry.email}
              onChange={handleChange}
              placeholder='Enter your email'
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              className='form-control'
              type="password"
              name="password"
              id="password"
              value={userEntry.password}
              onChange={handleChange}
              placeholder='Enter password'
              minLength='8'
              required
            />
            <span className="helper-text">Minimum 8 characters</span>
          </div>

          <div className="action-container">
            <button type="submit" className='btn btn-primary'>Login</button>
            <Link to="/register">Have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
