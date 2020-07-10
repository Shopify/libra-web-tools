import {makeExecutableSchema} from '@graphql-tools/schema';
import {
  forEachField,
  getUserTypesFromSchema,
  appendObjectFields,
} from '@graphql-tools/utils';
import {ApolloLink} from 'apollo-link';
import {SchemaLink} from 'apollo-link-schema';
import {GraphQLField, GraphQLSchema, GraphQLScalarType} from 'graphql';

import {typeDefs} from './graphql';
import {resolvers} from './resolvers';
import {createLibraRpc, createLibraFaucet} from './client';
import {Context} from './types';

export function addFieldRenameResolversToSchema(schema: GraphQLSchema) {
  function camelCaseToSnakeCase(name: string) {
    return name.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
  }

  function createFieldNameResolver({name}: GraphQLField<any, any>) {
    return function resolver(source: any) {
      const snakeCaseFieldName = camelCaseToSnakeCase(name);

      return snakeCaseFieldName in source
        ? source[snakeCaseFieldName]
        : source[name];
    };
  }

  forEachField(schema, (field) => {
    if (field.resolve == null && /[A-Z]/.test(field.name)) {
      field.resolve = createFieldNameResolver(field);
    }
  });

  return schema;
}

export function addDumpFieldToSchema(schema: GraphQLSchema) {
  const raw = schema.getType('Raw') as GraphQLScalarType;

  return getUserTypesFromSchema(schema).reduce((schema, type) => {
    const config = type.toConfig();

    return appendObjectFields(schema, type.name, {
      ...config.fields,
      _dump: {
        type: raw,
        resolve: (data) => data,
      },
    });
  }, schema);
}

export function createContext(target: string): Context {
  return {
    rpc: createLibraRpc(target),
    faucet: createLibraFaucet(target),
  };
}

export function createSchema() {
  return addDumpFieldToSchema(
    addFieldRenameResolversToSchema(
      makeExecutableSchema({
        typeDefs,
        resolvers,
      }),
    ),
  );
}

export function createApolloLink(target: string) {
  return ApolloLink.from([
    new SchemaLink({
      context: createContext(target),
      schema: createSchema(),
    }),
  ]);
}
