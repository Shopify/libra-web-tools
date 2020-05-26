import {Client, HTTPTransport, RequestManager} from '@open-rpc/client-js';

import {CreateClientTarget, LibraNetwork} from './types';

export function createClient(target: CreateClientTarget) {
  if (target instanceof Client) {
    return target;
  }

  if (target instanceof RequestManager) {
    return new Client(target);
  }

  if (Array.isArray(target)) {
    return new Client(new RequestManager(target));
  }

  if (typeof target === 'string') {
    const uri = KnownNetworks[target] || target;

    return new Client(new RequestManager([new HTTPTransport(uri)]));
  }

  return new Client(new RequestManager([target]));
}

export const KnownNetworks = {
  [LibraNetwork.Testnet]: 'https://client.testnet.libra.org',
};
