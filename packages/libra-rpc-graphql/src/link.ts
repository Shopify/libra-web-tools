import {SchemaLink} from 'apollo-link-schema';
import {makeExecutableSchema} from 'graphql-tools';

import {typeDefs} from './graphql';
import {resolvers} from './resolvers';
import {createClient} from './client';
import {CreateClientTarget} from './types';

export function createApolloLink(target: CreateClientTarget) {
  return new SchemaLink({
    context: {
      rpc: createClient(target),
    },
    schema: makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
  });
}
