import express, {Express} from 'express';
import {
  ApolloServer,
  ApolloServerExpressConfig,
  PlaygroundRenderPageOptions,
} from 'apollo-server-express';
import {print, GraphQLSchema} from 'graphql';

import {libraMintMutation, libraSeedMutation, libraTestQuery} from './graphql';
import {wallet} from './variables';

export interface TabOptions {
  endpoint?: string;
  minter?: boolean;
}

export interface ServerOptions {
  config?: Partial<ApolloServerExpressConfig>;
  context?: ApolloServerExpressConfig['context'];
  path?: string;
  tabs?: true | Omit<TabOptions, 'endpoint'>;
}

export interface MiddlewareOptions {
  app?: Express;
}

export const defaults = {
  path: '/graphql',
};

export function createTabs({
  endpoint = defaults.path,
  minter,
}: TabOptions = {}): PlaygroundRenderPageOptions['tabs'] {
  const variables = JSON.stringify(wallet, null, 2);

  const tabs = [
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
  ];

  if (minter) {
    tabs.push({
      endpoint,
      name: 'Libra Minter',
      query: print(libraMintMutation),
      variables,
    });
  }

  return tabs;
}

export function createServer(
  schema: GraphQLSchema,
  {
    config: {playground, ...config} = {},
    context,
    path = defaults.path,
    tabs,
  }: ServerOptions = {},
) {
  const tabOptions = getTabOptions();
  const playgroundOptions = typeof playground === 'boolean' ? {} : playground;

  return new ApolloServer({
    context,
    introspection: true,
    playground: {
      tabs: tabOptions ? createTabs(tabOptions) : undefined,
      ...playgroundOptions,
    },
    schema,
    ...config,
  });

  function getTabOptions() {
    if (!tabs) {
      return;
    }

    return tabs === true ? {endpoint: path} : {...tabs, endpoint: path};
  }
}

export function applyMiddleware(
  server: ApolloServer,
  {app = express()}: MiddlewareOptions = {},
) {
  server.applyMiddleware({app, path: server.graphqlPath});

  return app;
}
