import {makeExecutableSchema} from '@graphql-tools/schema';
import {forEachField} from '@graphql-tools/utils';
import {ApolloLink} from 'apollo-link';
import {SchemaLink} from 'apollo-link-schema';
import {GraphQLSchema} from 'graphql';

import {typeDefs} from './graphql';
import {resolvers} from './resolvers';
import {createLibraRpc} from './client';
import {Context} from './types';

export function addFieldRenameResolversToSchema(schema: GraphQLSchema) {
  const pattern = /[A-Z]/g;

  function camelCaseToSnakeCase(name: string) {
    return name.replace(pattern, (match) => `_${match.toLowerCase()}`);
  }

  function createFieldNameResolver(fieldName: string) {
    return function resolver(source: any) {
      return source[fieldName];
    };
  }

  forEachField(schema, (field) => {
    if (field.resolve == null && pattern.test(field.name)) {
      field.resolve = createFieldNameResolver(camelCaseToSnakeCase(field.name));
    }
  });

  return schema;
}

export const schema = addFieldRenameResolversToSchema(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
);

export function createContext(target: string): Context {
  return {
    rpc: createLibraRpc(target),
  };
}

export function createApolloLink(target: string) {
  return ApolloLink.from([
    new SchemaLink({
      context: createContext(target),
      schema,
    }),
  ]);
}
