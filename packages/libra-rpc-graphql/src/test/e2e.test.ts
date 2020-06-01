import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {createApolloLink} from '../../dist/src/link';
import {LibraNetwork} from '../../dist/src/types';

describe('e2e', () => {
  it('can fetch metadata from a remote RPC server', async () => {
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
