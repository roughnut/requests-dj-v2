
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../utils/mutations';
import { useSongContext } from '../utils/GlobalState';

export default function Login() {
  const [formState, setFormState] = useState({ username: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const { state, setUser } = useSongContext();
  
  const navigate = useNavigate();
  useEffect(() => {
    // If user is already authenticated, redirect to home page
    if (state.isAuthenticated) {
      navigate('/dashboard');
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
      setUser(data.login.user);
      // Redirect to home page after successful login
      navigate('/dashboard');
      window.location.reload();
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
      <h1 className='col-6'>Login</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          className='col-6 m-2'
          type="text"
          name="username"
          value={formState.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className='col-6 m-2' 
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button className='col-6 m-2' type="submit">Login</button>
      </form>
      {error && <p className='col-6 m-2'>Username or Password Incorrect</p>}
    </div>
  );
}
