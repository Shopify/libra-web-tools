import {Resolvers, ResolverInfo} from 'src/types';

export function mapResolvers(resolvers: Record<string, ResolverInfo<any>>) {
  return Object.entries(resolvers).reduce(
    (
      resolvers: Resolvers,
      [fieldName, {method, mapArgs}]: [string, ResolverInfo],
    ) => {
      resolvers[fieldName] = (_source, args, {rpc}) =>
        rpc.request(method, mapArgs ? mapArgs(args) : []);
      return resolvers;
    },
    {},
  );
}
