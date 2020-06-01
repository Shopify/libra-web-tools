/* eslint-env node */
/* eslint-disable no-console, no-process-env */

import express from 'express';
import {ApolloServer} from 'apollo-server-express';

import {createContext, schema} from '../src/link';
import {LibraNetwork} from '../src/types';

const {PORT = 8000} = process.env;
const [target = LibraNetwork.Testnet] = process.argv.slice(2);

const app = express();

const testQuery = `
fragment amountFields on Amount {
  amount
  currency
}

fragment accountFields on Account {
  sequenceNumber
  authenticationKey
  delegatedKeyRotationCapability
  delegatedWithdrawalCapability
  balances {
    ...amountFields
  }
  sentEventsKey
  receivedEventsKey
}

query LibraTestnetStatus(
  $account: HexString!
) {
  metadata {
    version
    timestamp
  }
  accountState(account: $account) {
    ...accountFields
  }
}
`.trim();

const path = '/graphql';
const endpoint = `http://localhost:${PORT}${path}`;

// these constants should be able to persist across any libra network deployment
// use https://librapaperwallet.com/ to create your own or use the wallet script
const wallet = {
  seed:
    'resource setup claim iron carpet east dose truck dry file olympic february own federal pioneer total candy beef usage heart relax dance library height',
  authKey: 'c9741e82d947540bc585fe48b350948711b57b9db55e734d2dde92d7cf89b261',
  // (last 32 chars of authKey)
  account: '11b57b9db55e734d2dde92d7cf89b261',
};

const server = new ApolloServer({
  context: ({
    req: {
      query: {network = target},
    },
  }) => createContext(network as string),
  introspection: true,

  playground: {
    tabs: [
      {
        endpoint,
        name: 'Libra GraphQL Test Query',
        query: testQuery,
        variables: JSON.stringify(
          {
            ...wallet,
          },
          null,
          2,
        ),
      },
    ],
  },
  schema,
});
server.applyMiddleware({app, path});

app.listen(PORT, () => {
  console.log(`🚀 GraphiQL running at ${endpoint}`);
});
