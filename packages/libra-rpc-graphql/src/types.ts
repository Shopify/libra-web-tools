import {
  Client,
  EventEmitterTransport,
  HTTPTransport,
  RequestManager,
  WebSocketTransport,
} from '@open-rpc/client-js';
import {IResolvers} from 'graphql-tools';

export interface Context {
  rpc: Client;
}

// the Transport abstract class isn't exported (yet) so we can just use a type
// union instead in the mean time.
type Transport = EventEmitterTransport | HTTPTransport | WebSocketTransport;
export type CreateClientTarget =
  | Client
  | RequestManager
  | Transport[]
  | Transport
  | LibraNetwork
  | string;

export type Resolvers = IResolvers<any, Context>;

export interface ResolverInfo<Args = {}> {
  method: string;
  mapArgs?(args: Args): any[];
}

export enum LibraNetwork {
  Testnet = 'testnet',
}
