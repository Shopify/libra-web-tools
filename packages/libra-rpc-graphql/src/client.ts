import {Client, HTTPTransport, RequestManager} from '@open-rpc/client-js';
import fetch from 'isomorphic-fetch';

import {isDevelopment} from './env';
import {LibraNetwork, LibraRPCMethods} from './types';

export function createClient(target: string) {
  const uri = KnownNetworks[target] || target;

  return new Client(new RequestManager([new HTTPTransport(uri)]));
}

export function createLibraRpc(target: string) {
  const client = createClient(target);

  return async function rpc(
    method: LibraRPCMethods,
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

export function createLibraFaucet(target: string) {
  const id = 'faucet';
  const baseUri = KnownFaucets[target] || target;

  /* eslint-disable @typescript-eslint/camelcase */
  function buildFaucetParams(
    auth_key: string,
    amount: number,
    currency_code = 'LBR',
  ) {
    return {
      amount: String(amount),
      auth_key,
      currency_code,
    };
  }
  /* eslint-enable @typescript-eslint/camelcase */

  return async function faucet(
    authKey: string,
    amountInMicroLibras: number,
    currencyCode?: string,
  ) {
    const params = buildFaucetParams(
      authKey,
      amountInMicroLibras,
      currencyCode,
    );

    try {
      const uri = `${baseUri}?${new URLSearchParams(params)}`;

      // logOperation(Operation.Request, id, uri);

      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      logOperation(Operation.Response, id, params, data);

      return data;
    } catch (error) {
      logOperation(Operation.Error, id, params, error);

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

  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.log(
      `${operation} ${id}(${hasParams ? JSON.stringify(params) : ''})`,
      ...[context].filter((value) => value !== undefined),
    );
  }
}

export const KnownNetworks = {
  [LibraNetwork.Testnet]: 'https://client.testnet.libra.org',
};

export const KnownFaucets = {
  [LibraNetwork.Testnet]: 'http://faucet.testnet.libra.org',
};
