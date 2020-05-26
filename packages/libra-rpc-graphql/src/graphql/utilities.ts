import {
  buildSchema,
  buildClientSchema,
  BuildSchemaOptions,
  GraphQLSchema,
  getIntrospectionQuery,
  graphqlSync,
  IntrospectionQuery,
  printSchema,
  Source,
} from 'graphql';
import {GraphQLSchemaValidationOptions, isSchema} from 'graphql/type/schema';
import {Options as PrintSchemaOptions} from 'graphql/utilities/schemaPrinter';

export function graphQLIntrospectionFromSchema(schema: GraphQLSchema) {
  const {data, errors} = graphqlSync(schema, getIntrospectionQuery());

  if (errors && errors.length > 0) {
    throw errors[0];
  }

  if (!data || !('__schema' in data)) {
    throw new Error('Invalid introspection response');
  }

  return data as IntrospectionQuery;
}

export enum SchemaFormat {
  Introspection,
  Schema,
  Sdl,
}

export type SchemaSdlSource = string | Source;
export type SchemaSource = SchemaSdlSource | GraphQLSchema | IntrospectionQuery;

export function isIntrospectionFormat(
  source: SchemaSource,
): source is IntrospectionQuery {
  return typeof source === 'object' && '__schema' in source;
}

export function schemaFormat(source: SchemaSource) {
  if (isSchema(source)) {
    return SchemaFormat.Schema;
  }

  if (isIntrospectionFormat(source)) {
    return SchemaFormat.Introspection;
  }

  return SchemaFormat.Sdl;
}

/* eslint-disable @typescript-eslint/unified-signatures */
export function convertSchema(
  source: GraphQLSchema,
  format: SchemaFormat.Introspection,
): IntrospectionQuery;
export function convertSchema(
  source: GraphQLSchema,
  format: SchemaFormat.Schema,
): GraphQLSchema;
export function convertSchema(
  source: GraphQLSchema,
  format: SchemaFormat.Sdl,
  options?: PrintSchemaOptions,
): string;
// ---
export function convertSchema(
  source: IntrospectionQuery,
  format: SchemaFormat.Introspection,
): IntrospectionQuery;
export function convertSchema(
  source: IntrospectionQuery,
  format: SchemaFormat.Schema,
  options?: GraphQLSchemaValidationOptions,
): GraphQLSchema;
export function convertSchema(
  source: IntrospectionQuery,
  format: SchemaFormat.Sdl,
  options?: GraphQLSchemaValidationOptions,
): string;
// ---
export function convertSchema(
  source: SchemaSdlSource,
  format: SchemaFormat.Introspection,
  options?: BuildSchemaOptions,
): IntrospectionQuery;
export function convertSchema(
  source: SchemaSdlSource,
  format: SchemaFormat.Schema,
  options?: BuildSchemaOptions,
): GraphQLSchema;
export function convertSchema(
  source: SchemaSdlSource,
  format: SchemaFormat.Sdl,
): string;
/* eslint-enable @typescript-eslint/unified-signatures */
export function convertSchema(
  source: SchemaSource,
  format: SchemaFormat,
  options?: any,
) {
  const sourceFormat = schemaFormat(source);

  if (isSchema(source)) {
    switch (format) {
      case SchemaFormat.Introspection:
        return graphQLIntrospectionFromSchema(source);
      case SchemaFormat.Schema:
        return source;
      case SchemaFormat.Sdl:
        return printSchema(source, options);
    }
  }

  if (isIntrospectionFormat(source)) {
    switch (format) {
      case SchemaFormat.Introspection:
        return source;
      case SchemaFormat.Schema:
        return buildClientSchema(source, options);
      case SchemaFormat.Sdl:
        return printSchema(buildClientSchema(source), options);
    }
  }

  switch (format) {
    case SchemaFormat.Introspection:
      return graphQLIntrospectionFromSchema(buildSchema(source, options));
    case SchemaFormat.Schema:
      return buildSchema(source, options);
    case SchemaFormat.Sdl:
      return source;
  }

  throw new Error(`Invalid conversion: ${sourceFormat} → ${format}`);
}
