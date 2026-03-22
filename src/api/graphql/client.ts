import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { apiConfig } from '../config';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: apiConfig.graphqlUrl,
  }),
  cache: new InMemoryCache(),
});
