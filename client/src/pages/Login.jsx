
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
// LOGIN_USER for GraphQL
import { LOGIN_USER } from '../utils/mutations';
import { useSongContext } from '../utils/GlobalState';
// LOGIN_USER uses LOGIN_ACTION as an alias for state
import { LOGIN_USER as LOGIN_ACTION } from '../utils/actions';

export default function Login() {
  const [formState, setFormState] = useState({ username: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const [state, dispatch] = useSongContext();
  
  // JW - not sure this is the best UI - if user is authenticated there should be no option to navigate to the login page - leaving it for now
  const navigate = useNavigate();
  useEffect(() => {
    // If user is already authenticated, redirect to home page
    if (state.isAuthenticated) {
      navigate('/');
    }
  }, [state.isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      localStorage.setItem('id_token', data.login.token);
      dispatch({
        type: LOGIN_ACTION,
        payload: data.login.user
      });
      // Redirect to home page after successful login
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  // If user is authenticated, this component will redirect, so we don't need to render anything
  if (state.isAuthenticated) {
    return null;
  }

  return (
    <div className='row justify-content-center'>
      <h1 className='col-12'>Login</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className='col-12 m-2'
          type="text"
          name="username"
          value={formState.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className='col-12 m-2' 
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button className='col-12 m-2' type="submit">Login</button>
      </form>
      {error && <p className='col-12 m-2'>Login failed</p>}
    </div>
  );
}