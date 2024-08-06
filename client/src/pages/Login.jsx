import React, { useState } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginFormHandler = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (username && password) {
      const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/");
      } else {
        alert("Incorrect Username or Password entered. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-4xl font-bold text-custom-charcoal">Login</h2>
      <form className="w-1/2 login-form" onSubmit={loginFormHandler}>
        <div>
          <label htmlFor="username-login" className="block font-bold text-custom-charcoal">Username:</label>
          <input
            type="text"
            name="username-login"
            id="username-login"
            className="border-2 border-custom-brown bg-zinc-50 block w-full rounded-sm px-2 py-1 focus:outline-none focus:ring focus:ring-orange-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password-login" className="block font-bold text-custom-charcoal">Password:</label>
          <input
            type="password"
            name="password-login"
            id="password-login"
            className="border-2 border-custom-brown bg-zinc-50 block w-full rounded-sm px-2 py-1 focus:outline-none focus:ring focus:ring-orange-200"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-custom-charcoal text-white px-6 py-2 rounded-full transition-all hover:bg-custom-green mt-4">Login</button>
      </form>
    </div>
  );
}

export default Login;