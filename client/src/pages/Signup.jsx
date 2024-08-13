import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import { useSongContext } from '../utils/GlobalState';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formState, setFormState] = useState({ username: '', password: '' });
  const [addUser, { error }] = useMutation(ADD_USER);
  const { setUser } = useSongContext();
  const navigate = useNavigate();

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
      console.log('Form State: ', formState);
      const { data } = await addUser({
        variables: { ...formState },
      });
      localStorage.setItem('id_token', data.addUser.token);
      setUser(data.addUser.user);
      // Redirect to events page after successful signup
      navigate('/events');
    } catch (err) {
      console.error('Signup error: ', err);
    }
  };

  return (
    <div>
      <h1 className='row justify-content-center'>Signup</h1>
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
        <button className='col-12 m-2' type="submit">Sign Up</button>
      </form>
      {error && <p className='col-12 m-2'>Signup failed</p>}
    </div>
  );
}
