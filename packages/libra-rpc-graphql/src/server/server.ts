import express, {Express} from 'express';
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

export interface EndpointOptions {
  host?: string;
  path?: string;
  port?: number;
}

export interface ApolloOptions extends EndpointOptions {
  config?: ApolloServerExpressConfig;
  tabs?: boolean;
  network?: string;
}

export interface ServerOptions extends ApolloOptions {
  server?: ApolloServer;
  app?: Express;
}

export const defaults = {
  host: 'localhost',
  path: '/graphql',
  port: 8000,
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

export function createEndpoint({
  host = defaults.host,
  path = defaults.path,
  port = defaults.port,
}: EndpointOptions) {
  return `http://${host}:${port}${path}`;
}

export function createApollo({
  config,
  tabs = false,
  network: staticNetwork = defaults.network,
  ...endpointOptions
}: ApolloOptions = {}) {
  return new ApolloServer({
    context: ({
      req: {
        query: {network = staticNetwork},
      },
    }) => createContext(network as string),
    playground: {
      tabs: tabs ? createTabs(createEndpoint(endpointOptions)) : undefined,
    },
    schema: createSchema(),
    ...config,
  });
}

export function start({
  app = express(),
  server,
  ...options
}: ServerOptions = {}) {
  const {path = defaults.path, port = defaults.port} = options;

  (server || createApollo(options)).applyMiddleware({app, path});

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀  GraphQL playground running at ${createEndpoint(options)}`);
  });

  return app;
}
