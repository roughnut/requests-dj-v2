// Include code here for a Navbar.
import "../App.css";

export default function Navbar() {
    return (
      <div>
        <a className="navi" href="/">Home</a>
        <a className="navi" href="/login">Login</a>
        <a className="navi" href="/signup">Signup</a>
        <a className="navi" href="/events">Events</a>
      </div>
    );
  }