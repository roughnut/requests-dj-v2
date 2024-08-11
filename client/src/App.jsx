import { Outlet } from 'react-router-dom';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SongProvider } from './utils/GlobalState';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Auth from './utils/auth';

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Create a middleware to attach the JWT token to every request
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const isAuthenticated = Auth.loggedIn(); // Use AuthService to check if user is logged in
  return (
    <ApolloProvider client={client}>
      <SongProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1 py-4">
            <div className="container">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </SongProvider>
    </ApolloProvider>
  );
}

export default App;