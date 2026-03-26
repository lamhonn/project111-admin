import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { apiConfig } from '../config';
import { getValidStoredToken } from '../auth/tokenStorage';

const httpLink = new HttpLink({
  uri: apiConfig.graphqlUrl,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getValidStoredToken();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: apiConfig.websocketUrl,
    connectionParams: () => {
      const token = getValidStoredToken();
      return token ? { authorization: `Bearer ${token}` } : {};
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
