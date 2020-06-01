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

fragment eventDataFields on EventData {
  __typename
  type

  ... on ReceivedPaymentEventData {
    amount {
      ...amountFields
    }
    sender
    metadata
  }

  ... on SentPaymentEventData {
    amount {
      ...amountFields
    }
  }

  ... on NewBlockEventData {
    proposedTime
    proposer
    round
  }

  ... on MintEventData {
    amount {
      ...amountFields
    }
  }
}

fragment eventFields on Event {
  key
  sequenceNumber
  transactionVersion
  data {
    ...eventDataFields
  }
}

fragment scriptFields on UserTransactionScript {
  __typename
  type

  ... on MintScript {
    receiver
    authKeyPrefix
    amount
  }

  ... on PeerToPeerTransferScript {
    receiver
    authKeyPrefix
    amount
    metadata
  }
}

fragment transactionDataFields on TransactionData {
  __typename
  type

  ... on BlockMetadataTransactionData {
    timestampUsecs
  }

  ... on UserTransactionData {
    sender
    signatureScheme
    signature
    publicKey
    sequenceNumber
    maxGasAmount
    gasUnitPrice
    expirationTime
    scriptHash
    script {
      ...scriptFields
    }
  }
}

fragment transactionFields on Transaction {
  version
  vmStatus
  gasUsed
  data {
    ...transactionDataFields
  }
  events {
    ...eventFields
  }
}

query LibraTestnetStatus(
  $account: HexString!
  $sentKey: ID!
  $receivedKey: ID!
  $transactionSequence: Int64!
  $transactionVersion: Int64!
) {
  metadata {
    version
    timestamp
  }
  accountState(account: $account) {
    ...accountFields
  }
  accountTransaction(
    account: $account
    sequence: $transactionSequence
    includeEvents: true
  ) {
    ...transactionFields
  }
  sent: events(key: $sentKey, start: 0, limit: 10) {
    ...eventFields
  }
  received: events(key: $receivedKey, start: 0, limit: 10) {
    ...eventFields
  }
  transactions(
    startVersion: $transactionVersion
    limit: 1
    includeEvents: true
  ) {
    ...transactionFields
  }
}
`.trim();
const mintQuery = `
mutation LibraMinter($authKey: HexString!) {
  mint(
    input: {
      authKey: $authKey
      amountInMicroLibras: 1000000
    }
  )
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
            sentKey: '010000000000000011b57b9db55e734d2dde92d7cf89b261',
            receivedKey: '000000000000000011b57b9db55e734d2dde92d7cf89b261',
            transactionSequence: '0',
            transactionVersion: '5126849',
          },
          null,
          2,
        ),
      },
      {
        endpoint,
        name: 'Libra Minter',
        query: mintQuery,
        variables: JSON.stringify(wallet, null, 2),
      },
    ],
  },
  schema,
});
server.applyMiddleware({app, path});

app.listen(PORT, () => {
  console.log(`🚀 GraphiQL running at ${endpoint}`);
});
