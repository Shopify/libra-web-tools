import {Client, HTTPTransport, RequestManager} from '@open-rpc/client-js';

import {LibraNetwork} from './types';

export function createClient(target: string) {
  const uri = KnownNetworks[target] || target;

  return new Client(new RequestManager([new HTTPTransport(uri)]));
}

export function createLibraRpc(target: string) {
  const client = createClient(target);

  return async function rpc(
    method: string,
    params: any[] = [],
    timeout?: number,
  ) {
    try {
      // logOperation(Operation.Request, method, params);

      const response = await client.request(method, params, timeout);

      logOperation(
        Operation.Response,
        method,
        params,
        JSON.stringify(response, null, 2),
      );

      return response;
    } catch (error) {
      logOperation(Operation.Error, method, params, error);

      throw error;
    }
  };
}

enum Operation {
  Request = '→',
  Response = '←',
  Error = '✘',
}

function logOperation(
  operation: Operation,
  id: string,
  params: any,
  context?: any,
) {
  const hasParams =
    params &&
    ((Array.isArray(params) && params.length > 0) ||
      (typeof params === 'object' && Object.keys(params).length > 0));

  // eslint-disable-next-line no-console
  console.log(
    `${operation} ${id}(${hasParams ? JSON.stringify(params) : ''})`,
    ...[context].filter((value) => value !== undefined),
  );
}

export const KnownNetworks = {
  [LibraNetwork.Testnet]: 'https://client.testnet.libra.org',
};
