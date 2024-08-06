import React, { useState } from 'react';

function Signup() {
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const signupFormHandler = async (event) => {
    event.preventDefault();

    if (!signupUsername || !signupPassword) {
      alert("Please fill in all fields.");
      return;
    }

    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      alert("Unable to sign up, please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="text-4xl font-bold text-custom-charcoal">Signup</h2>
      <form className="w-1/2 signup-form" onSubmit={signupFormHandler}>
        <div>
          <label htmlFor="username-signup" className="block font-bold text-custom-charcoal">Username:</label>
          <input
            type="text"
            name="username-signup"
            id="username-signup"
            className="border-2 border-custom-brown bg-zinc-50 block w-full rounded-sm px-2 py-1 focus:outline-none focus:ring focus:ring-orange-200"
            value={signupUsername}
            onChange={(e) => setSignupUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password-signup" className="block font-bold text-custom-charcoal">Password:</label>
          <input
            type="password"
            name="password-signup"
            id="password-signup"
            className="border-2 border-custom-brown bg-zinc-50 block w-full rounded-sm px-2 py-1 focus:outline-none focus:ring focus:ring-orange-200"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-custom-charcoal text-white px-6 py-2 rounded-full transition-all hover:bg-custom-green mt-4">Signup</button>
      </form>
    </div>
  );
}

export default Signup;