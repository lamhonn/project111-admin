import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { apiConfig } from '../config';

const AUTH_TOKEN_STORAGE_KEY = 'authToken';

const httpLink = new HttpLink({
  uri: apiConfig.graphqlUrl,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
