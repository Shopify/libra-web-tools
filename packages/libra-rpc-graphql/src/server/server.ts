import express from 'express';
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

export interface ServerOptions {
  config?: ApolloServerExpressConfig;
  host?: string;
  path?: string;
  port?: number;
  tabs?: boolean;
  network?: string;
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
}: ServerOptions) {
  return `http://${host}:${port}${path}`;
}

export function createServer({
  config,
  tabs = false,
  network: staticNetwork = defaults.network,
  ...endpointOptions
}: ServerOptions = {}) {
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

export function startExpress(
  options: ServerOptions = {},
  server: ApolloServer = createServer(options),
) {
  const app = express();
  const {path = defaults.path, port = defaults.port} = options;

  server.applyMiddleware({app, path});

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀  GraphQL playground running at ${createEndpoint(options)}`);
  });

  return app;
}
