import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import { useSongContext } from '../utils/GlobalState';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formState, setFormState] = useState({ username: '', password: '', is_dj: false });
  const [addUser, { error }] = useMutation(ADD_USER);
  const { setUser } = useSongContext();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: name === 'is_dj' ? event.target.checked : value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });
      localStorage.setItem('id_token', data.addUser.token);
      setUser(data.addUser.user);
      // Redirect to home page after successful signup
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="username"
          value={formState.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <label>
          <input
            type="checkbox"
            name="is_dj"
            checked={formState.is_dj}
            onChange={handleChange}
          />
          Are you a DJ?
        </label>
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>Signup failed</p>}
    </div>
  );
}

// Comments:
// - Removed import for actions.js
// - Updated useSongContext to destructure setUser
// - Replaced dispatch call with direct call to setUser
// - Added useNavigate hook for redirection after successful signup
// - Removed LOGIN_USER import from actions
