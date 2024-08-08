import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SongProvider } from './utils/GlobalState';

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
  return (
    <ApolloProvider client={client}>
      <SongProvider>
        <main className="mx-3">
          <Outlet />
        </main>
      </SongProvider>
    </ApolloProvider>
  );
}

export default App;