import {Client} from '@open-rpc/client-js';
import {IResolvers} from '@graphql-tools/utils';

export interface Context {
  rpc: Client['request'];
  faucet(
    authKey: string,
    amountInMicroLibras: number,
    currencyCode?: string,
  ): Promise<any>;
}

export type Resolvers = IResolvers<any, Context>;

export interface ResolverInfo<Args = {}> {
  method: string;
  mapArgs?(args: Args): any[];
}

export enum LibraNetwork {
  Testnet = 'testnet',
}
