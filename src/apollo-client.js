
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000'
});

const client = new ApolloClient({ cache, link });

export default client