import {IResolvers} from '@graphql-tools/utils';

export type LibraRpcMethods =
  | 'get_account'
  | 'get_account_transaction'
  | 'get_account_transactions'
  | 'get_currencies'
  | 'get_events'
  | 'get_metadata'
  | 'get_transactions'
  | 'submit';

export interface LibraRpcOptions {
  id?: number;
}

export interface Context {
  rpc(
    method: LibraRpcMethods,
    params?: any[],
    options?: LibraRpcOptions,
  ): Promise<any>;
  faucet(
    authKey: string,
    amountInMicroLibras: number,
    currencyCode?: string,
  ): Promise<any>;
}

export type Resolvers = IResolvers<any, Context>;

export interface ResolverInfo<Args = {}> {
  method: LibraRpcMethods;
  mapArgs?(args: Args): any[];
  transform?(result: any, args: Args): any;
}

export enum LibraNetwork {
  Testnet = 'testnet',
}
