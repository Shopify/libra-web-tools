/* eslint-env node */
/* eslint-disable no-console, no-process-env */

import express from 'express';
import {ApolloServer, PlaygroundRenderPageOptions} from 'apollo-server-express';
import {print} from 'graphql';
import gql from 'graphql-tag';

import {createContext, createSchema} from '../src/link';
import {LibraNetwork} from '../src/types';

const {HOST = 'localhost', PORT = 8000} = process.env;
const [target = LibraNetwork.Testnet] = process.argv.slice(2);

const app = express();

const path = '/graphql';
const endpoint = `http://${HOST}:${PORT}${path}`;

// these variables are the result of the wallet query
const variables = {
  phrase:
    'resource setup claim iron carpet east dose truck dry file olympic february own federal pioneer total candy beef usage heart relax dance library height',
  key: 'f080ac2748fde3a53318492f8466b200b39afc3b09a496433db6dcca1243953d',
  secretKey: '81212144b0f8358aaa94ff5f595d5a1274527ce325ff508fe27748e607850463',
  publicKey: 'dc741284bd42ec0c9250706c4bbe9a651fe8b1ba2cd5b28f9b09f813cb02f3e1',
  authKey: '239ed09c441bb3307b3c5abc878879581d0a20b6462d3e8dbb21784b1f1314e9',
  address: '1d0a20b6462d3e8dbb21784b1f1314e9',
};

const queries = gql`
  query LibraTestnet($phrase: String!, $address: HexString!) {
    wallet(phrase: $phrase) {
      seed {
        phrase
        key
      }
      account {
        secretKey
        publicKey
        authKey
        address
      }
    }
    received: accountState(address: $address) {
      receivedEvents {
        ...receivedEventFields
      }
    }
    sent: accountState(address: $address) {
      sentEvents {
        ...sentEventFields
      }
    }
    transactions: accountState(address: $address) {
      transactions {
        version
        hash
        vmStatus
        gasUsed
        data {
          __typename
          ... on UserTransactionData {
            ...userTransactionFields
          }
        }
      }
    }
  }

  fragment amountFields on Amount {
    amount
    currency
  }

  fragment accountFields on AccountState {
    sequenceNumber
    address
    authenticationKey
    balances {
      ...amountFields
    }
  }

  fragment sentEventDataFields on SentPaymentEventData {
    amount {
      ...amountFields
    }
    metadata
    receiver {
      ...accountFields
    }
  }

  fragment receivedEventDataFields on ReceivedPaymentEventData {
    amount {
      ...amountFields
    }
    metadata
    sender {
      ...accountFields
    }
  }

  fragment eventFields on Event {
    sequenceNumber
    transaction(includeEvents: true) {
      version
      hash
      vmStatus
      gasUsed
      data {
        ...userTransactionFields
      }
      events {
        data {
          __typename
          ... on MintEventData {
            amount {
              ...amountFields
            }
          }
        }
      }
    }
    data {
      __typename
    }
  }

  fragment receivedEventFields on Event {
    ...eventFields
    transaction(includeEvents: true) {
      events {
        data {
          ... on SentPaymentEventData {
            ...sentEventDataFields
          }
        }
      }
    }
    data {
      ... on ReceivedPaymentEventData {
        ...receivedEventDataFields
      }
    }
  }

  fragment sentEventFields on Event {
    ...eventFields
    transaction(includeEvents: true) {
      events {
        data {
          ... on ReceivedPaymentEventData {
            ...receivedEventDataFields
          }
        }
      }
    }
    data {
      ... on SentPaymentEventData {
        ...sentEventDataFields
      }
    }
  }

  fragment userTransactionFields on UserTransactionData {
    signatureScheme
    signature
    publicKey
    sequenceNumber
    maxGasAmount
    gasUnitPrice
    gasCurrency
    expirationTime
    scriptHash
    script {
      __typename
      ... on MintScript {
        receiver {
          ...accountFields
        }
        amount
      }
      ... on PeerToPeerTransferScript {
        receiver {
          ...accountFields
        }
        amount
        currency
        metadata
        metadataSignature
      }
    }
  }
`;

const mutations = gql`
  mutation LibraWallet {
    createSeed {
      phrase
      key
      wallet {
        account {
          authKey
          address
        }
      }
    }
  }

  mutation LibraMint($authKey: HexString!) {
    mint(
      input: {authKey: $authKey, amountInMicroLibras: 1e6, currencyCode: "LBR"}
    ) {
      sequenceNumber
      address
      balances {
        ...amountFields
      }
      receivedEvents {
        key
        sequenceNumber
        transactionVersion
        data {
          ... on ReceivedPaymentEventData {
            amount {
              ...amountFields
            }
            senderAddress
          }
        }
      }
    }
  }

  fragment amountFields on Amount {
    amount
    currency
  }
`;

const tabs: PlaygroundRenderPageOptions['tabs'] = [
  {
    endpoint,
    name: 'Libra Test Query',
    query: print(queries),
    variables: JSON.stringify(variables, null, 2),
  },
  {
    endpoint,
    name: 'Libra Mutations',
    query: print(mutations),
    variables: JSON.stringify(variables, null, 2),
  },
];

const server = new ApolloServer({
  context: ({
    req: {
      query: {network = target},
    },
  }) => createContext(network as string),
  // introspection: true,

  playground: {
    tabs,
  },
  schema: createSchema(),
});
server.applyMiddleware({app, path});

app.listen(PORT, () => {
  console.log(`🚀  GraphQL playground running at ${endpoint}`);
});
