import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import {Response} from 'node-fetch';

import {createApolloLink} from '../../dist/src/link';
import {LibraNetwork} from '../../dist/src/types';

jest.mock('isomorphic-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const fetchMock: jest.Mock = jest.requireMock('isomorphic-fetch').default;

describe('e2e', () => {
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('can fetch metadata from a remote RPC server', async () => {
    const metadata = {
      version: 123,
      timestamp: 123,
    };
    fetchMock.mockReturnValue({
      text: () => JSON.stringify({id: 0, jsonrpc: '2.0', result: metadata}),
    });

    const query = gql`
      query TestQuery {
        metadata {
          version
          timestamp
        }
      }
    `;
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: createApolloLink(LibraNetwork.Testnet),
    });

    const result = await client.query({
      query,
    });

    expect(result).toMatchObject({
      data: {
        metadata: {
          __typename: 'Metadata',
          version: expect.any(Number),
          timestamp: expect.any(Number),
        },
      },
    });
  });
});
