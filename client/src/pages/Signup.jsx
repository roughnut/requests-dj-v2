
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import { useSongContext } from '../utils/GlobalState';
import { LOGIN_USER } from '../utils/actions';

export default function Signup() {
  const [formState, setFormState] = useState({ username: '', password: '', is_dj: false });
  const [addUser, { error }] = useMutation(ADD_USER);
  const [dispatch] = useSongContext(); // 'state' property not used (yet)

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
      dispatch({
        type: LOGIN_USER,
        payload: data.addUser.user
      });
      // TODO: Redirect to home page or dashboard
    } catch (e) {
      console.error(e);
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
        <label>
          <input
            type="checkbox"
            name="is_dj"
            checked={formState.is_dj}
            onChange={handleChange}
          />
          Are you a DJ?
        </label>
        <button className='col-12 m-2' type="submit">Sign Up</button>
      </form>
      {error && <p className='col-12 m-2'>Signup failed</p>}

    </div>
  );
}