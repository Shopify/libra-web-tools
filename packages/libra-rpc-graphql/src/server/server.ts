import {Express} from 'express';
import {
  ApolloServer,
  ApolloServerExpressConfig,
  PlaygroundRenderPageOptions,
} from 'apollo-server-express';
import {print} from 'graphql';

import {createContext, createSchema} from '../link';
import {LibraNetwork} from '../types';

import {libraMintMutation, libraSeedMutation, libraTestQuery} from './graphql';
import {wallet} from './variables';

export interface ApolloOptions {
  config?: ApolloServerExpressConfig;
  network?: string;
  path?: string;
  tabs?: boolean;
}

export const defaults = {
  path: '/graphql',
  network: LibraNetwork.Testnet,
};

export function createTabs(
  endpoint: string,
): PlaygroundRenderPageOptions['tabs'] {
  const variables = JSON.stringify(wallet, null, 2);

  return [
    {
      endpoint,
      name: 'Libra Test Query',
      query: print(libraTestQuery),
      variables,
    },
    {
      endpoint,
      name: 'Libra Seed Creator',
      query: print(libraSeedMutation),
      variables,
    },
    {
      endpoint,
      name: 'Libra Minter',
      query: print(libraMintMutation),
      variables,
    },
  ];
}

export function createApollo({
  config,
  tabs = false,
  network: staticNetwork = defaults.network,
  path = defaults.path,
}: ApolloOptions = {}) {
  return new ApolloServer({
    context: ({
      req: {
        query: {network = staticNetwork},
      },
    }) => createContext(network as string),
    introspection: true,
    playground: {
      tabs: tabs ? createTabs(path) : undefined,
    },
    schema: createSchema(),
    ...config,
  });
}

export function applyMiddleware(
  app: Express,
  apollo?: ApolloServer | ApolloOptions,
) {
  const server = apollo instanceof ApolloServer ? apollo : createApollo(apollo);

  server.applyMiddleware({app, path: server.graphqlPath});

  return app;
}
