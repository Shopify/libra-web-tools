import {IntrospectionQuery} from 'graphql';

import introspection from './schema.json';
import {convertSchema, SchemaFormat} from './utilities';

export const introspectionQuery = introspection as IntrospectionQuery;
export const schema = convertSchema(introspection, SchemaFormat.Schema);
export const typeDefs = convertSchema(schema, SchemaFormat.Sdl);
