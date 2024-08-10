// Include code here for a Navbar.
import "../App.css";
import React from "react";
import Auth from "../utils/auth";
import { useSongContext } from "../utils/GlobalState";

export default function Navbar() {
  const { state } = useSongContext();

  const handleLogout = () => {
    Auth.logout();
  };

  return (
    <div>
      <a className="navi" href="/">Home</a>
      <a className="navi" href="/events">Events</a>

      {state.isAuthenticated ? (
        <>
          <a className="navi" href="/" onClick={handleLogout}>Logout</a>
        </>
      ) : (
        <>
          <a className="navi" href="/login">Login</a>
          <a className="navi" href="/signup">Signup</a>
        </>
      )}
    </div>
  );
}