import {IResolvers} from '@graphql-tools/utils';

export type LibraRPCMethods =
  | 'get_account_state'
  | 'get_account_transaction'
  | 'get_currencies'
  | 'get_events'
  | 'get_metadata'
  | 'get_transactions'
  | 'submit';

export interface Context {
  rpc(method: LibraRPCMethods, params?: any[], timeout?: number): Promise<any>;
  faucet(
    authKey: string,
    amountInMicroLibras: number,
    currencyCode?: string,
  ): Promise<any>;
}

export type Resolvers = IResolvers<any, Context>;

export interface ResolverInfo<Args = {}> {
  method: LibraRPCMethods;
  mapArgs?(args: Args): any[];
  transform?(result: any, args: Args): any;
}

export enum LibraNetwork {
  Testnet = 'testnet',
}
