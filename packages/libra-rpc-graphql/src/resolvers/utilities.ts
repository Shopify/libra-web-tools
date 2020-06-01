import {Resolvers, ResolverInfo} from 'src/types';

export function mapResolvers(resolvers: Record<string, ResolverInfo<any>>) {
  return Object.entries(resolvers).reduce(
    (
      resolvers: Resolvers,
      [fieldName, {method, mapArgs}]: [string, ResolverInfo],
    ) => {
      resolvers[fieldName] = (_source, args, {rpc}) =>
        rpc(method, mapArgs && mapArgs(args));
      return resolvers;
    },
    {},
  );
}

export function mapAbstractType(
  type: Record<string, string>,
  fieldName: string,
) {
  const name = fieldName;
  const typename = Object.entries(type).reduce(
    (map, [key, value]) => {
      map[value] = key;
      return map;
    },
    {} as Record<string, string>,
  );

  return function abstractType(source) {
    if (!(name in source)) {
      throw new Error(`${name} not found in abstract type`);
    }

    const field = source[name];

    if (field.type == null || !(field.type in typename)) {
      throw new Error(
        `${name} as unrecognized type ${field.type || 'NULL'} in abstract type`,
      );
    }

    return {
      __typename: typename[field.type],
      ...field,
    };
  };
}
