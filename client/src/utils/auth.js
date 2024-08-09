import decode from "jwt-decode";

class AuthService {
  // Get user data from token
  getProfile() {
    const token = this.getToken();
    if (token) {
      try {
        return decode(token);
      } catch (error) {
        console.error('Invalid token specified:', error);
        return null; // Return null if the token is invalid
      }
    }
    return null; // Return null if no token is present
  }

  // Check if user is logged in
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); 
  }

  // Check if the token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.error('Error decoding token:', err);
      return true; // Consider the token expired if there's an error
    }
  }

  // Retrieve the user token from localStorage
  getToken() {
    return localStorage.getItem("id_token");
  }

  // Save user token to localStorage and redirect
  login(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  // Clear user token and profile data from localStorage and redirect
  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new AuthService();