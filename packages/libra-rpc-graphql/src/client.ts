import fetch from 'isomorphic-fetch';

import {isDevelopment} from './env';
import {LibraNetwork, LibraRpcMethods, LibraRpcOptions} from './types';

type JSONRpcParam = string | number;

export interface JSONRpcPayload {
  id?: number;
  jsonrpc: '2.0';
  method: LibraRpcMethods;
  params: JSONRpcParam[];
}

export function createLibraRpcPayload(
  method: LibraRpcMethods,
  params: JSONRpcParam[] = [],
  id?: number,
) {
  const payload: JSONRpcPayload = {jsonrpc: '2.0', method, params};

  if (id) {
    payload.id = id;
  }

  return payload;
}

export function getNetworkUri(target: string) {
  if (target.startsWith('http')) {
    return target;
  }

  return KnownNetworks[target];
}

export function createLibraRpc(target: string) {
  const uri = getNetworkUri(target);

  return async function rpc(
    method: LibraRpcMethods,
    params: JSONRpcParam[] = [],
    {id}: LibraRpcOptions = {},
  ) {
    try {
      // logOperation(Operation.Request, method, params);

      if (!uri) {
        throw new Error(`Unknown network: ${target}`);
      }

      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createLibraRpcPayload(method, params, id)),
      });

      const data = await response.json();

      logOperation(
        Operation.Response,
        method,
        params,
        JSON.stringify(data, null, 2),
      );

      if ('result' in data && typeof data.result === 'object') {
        const {result, ...rpcMetadata} = data;

        if (result) {
          result._rpcMetadata = rpcMetadata;
        }

        return result;
      }

      throw new Error('Invalid Response');
    } catch (error) {
      logOperation(Operation.Error, method, params, error);

      throw error;
    }
  };
}

export function getFaucetUri(target: string) {
  if (target.startsWith('http')) {
    return target;
  }

  return KnownFaucets[target];
}

export function createLibraFaucet(target: string) {
  const baseUri = getFaucetUri(target);
  const id = 'faucet';

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
      const uri = baseUri && `${baseUri}?${new URLSearchParams(params)}`;

      // logOperation(Operation.Request, id, uri);

      if (!uri) {
        throw new Error(`Unknown faucet: ${target}`);
      }

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
  [LibraNetwork.Testnet]: 'https://client.testnet.diem.com',
};

export const KnownFaucets = {
  [LibraNetwork.Testnet]: 'http://faucet.testnet.diem.com',
};
