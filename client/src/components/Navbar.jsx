// Include code here for a Navbar.
import "../App.css";

export default function Navbar() {
    return (
      <div>
        <a className="nav" href="/login">Login</a>
        <a className="nav" href="/signup">Signup</a>
        <a className="nav" href="/event">Event</a>
        <a className="nav" href="/">Home</a>
      </div>
    );
  }