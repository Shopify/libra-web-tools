import {Client} from '@open-rpc/client-js';
import {IResolvers} from '@graphql-tools/utils';

export interface Context {
  rpc: Client['request'];
}

export type Resolvers = IResolvers<any, Context>;

export interface ResolverInfo<Args = {}> {
  method: string;
  mapArgs?(args: Args): any[];
}

export enum LibraNetwork {
  Testnet = 'testnet',
}
