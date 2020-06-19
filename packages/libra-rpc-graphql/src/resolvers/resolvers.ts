/* eslint-disable @typescript-eslint/camelcase */
import {
  LibraSeed,
  LibraSeedPhrase,
  LibraWallet,
  LibraAccount,
} from '@shopify/libra-web-wallet-utils';
import {Resolvers} from 'src/types';

import {Context} from '../types';

import {EventDataType, ScriptType, TransactionDataType} from './types';
import {mapAbstractType, mapResolvers} from './utilities';

function injectAddress(data: any, {address}) {
  if (!address) {
    return data;
  }

  return {
    ...data,
    address,
  };
}

async function accountState(rpc: Context['rpc'], address: string) {
  const state = await rpc('get_account_state', [address]);

  return injectAddress(state, {address});
}

export const resolvers: Resolvers = {
  Query: {
    ...mapResolvers({
      accountState: {
        method: 'get_account_state',
        mapArgs: ({address}) => [address],
        transform: injectAddress,
      },
      accountTransaction: {
        method: 'get_account_transaction',
        mapArgs: ({address, sequence, includeEvents = false}) => [
          address,
          Number(sequence),
          includeEvents,
        ],
      },
      currencies: {
        method: 'get_currencies',
      },
      events: {
        method: 'get_events',
        mapArgs: ({key, start, limit}) => [key, start, limit],
      },
      metadata: {
        method: 'get_metadata',
        mapArgs: () => [''],
      },
      transaction: {
        method: 'get_transactions',
        mapArgs: ({version, includeEvents = false}) => [
          Number(version),
          1,
          includeEvents,
        ],
        transform([transaction]: any[] = []) {
          return transaction;
        },
      },
      transactions: {
        method: 'get_transactions',
        mapArgs: ({startVersion, limit, includeEvents = false}) => [
          Number(startVersion),
          Number(limit),
          includeEvents,
        ],
        transform(transactions: any[], {includeMetadata = false}) {
          if (includeMetadata) {
            return transactions;
          }

          return transactions.filter(
            ({transaction: {type}}) =>
              type !== TransactionDataType.BlockMetadataTransactionData,
          );
        },
      },
    }),
    wallet(_source, {key, phrase}) {
      return LibraWallet.fromKeyOrPhrase({key, phrase});
    },
    account(_source, {secretKey}) {
      return LibraAccount.fromSecretKey(secretKey);
    },
  },
  Mutation: {
    ...mapResolvers({
      submitTransaction: {
        method: 'submit',
        mapArgs: ({input: {data}}) => [data],
      },
    }),
    createSeed() {
      return LibraSeedPhrase.generate();
    },
    async mint(
      _source,
      {input: {authKey, amountInMicroLibras, currencyCode}},
      {faucet, rpc},
    ) {
      await faucet(authKey, Number(amountInMicroLibras), currencyCode);

      return accountState(rpc, LibraAccount.authKeyParts(authKey).address);
    },
  },

  Account: {
    state({address}: LibraAccount, _args, {rpc}) {
      return accountState(rpc, address);
    },
  },
  AccountState: {
    address({address, authentication_key}) {
      return address || LibraAccount.authKeyParts(authentication_key).address;
    },
    authenticationKeyPrefix({authentication_key}) {
      return LibraAccount.authKeyParts(authentication_key).authKeyPrefix;
    },
    sentEvents({sent_events_key}, {start = 0, limit = 10}, {rpc}) {
      return rpc('get_events', [sent_events_key, start, limit]);
    },
    receivedEvents({received_events_key}, {start = 0, limit = 10}, {rpc}) {
      return rpc('get_events', [received_events_key, start, limit]);
    },
    transaction(
      {address, authentication_key},
      {sequence, includeEvents = false},
      {rpc},
    ) {
      return rpc('get_account_transaction', [
        address || LibraAccount.authKeyParts(authentication_key).address,
        sequence,
        includeEvents,
      ]);
    },
    async transactions(
      {address, authentication_key, sequence_number},
      {start = 0, limit = 10, includeEvents = false},
      {rpc},
    ) {
      const transactions: any[] = [];

      for (
        let sequence = start;
        transactions.length < limit && sequence < sequence_number;
        ++sequence
      ) {
        const transaction = await rpc('get_account_transaction', [
          address || LibraAccount.authKeyParts(authentication_key).address,
          sequence,
          includeEvents,
        ]);

        if (transaction) {
          transactions.push(transaction);
        }
      }

      return transactions;
    },
  },
  Event: {
    data: mapAbstractType(EventDataType, 'data'),
    async transaction({transaction_version}, {includeEvents = false}, {rpc}) {
      const [transaction] = await rpc('get_transactions', [
        transaction_version,
        1,
        includeEvents,
      ]);

      return transaction;
    },
  },
  MintScript: {
    receiverAddress({receiver}) {
      return receiver;
    },
    receiver({receiver}, _args, {rpc}) {
      return accountState(rpc, receiver);
    },
  },
  NewBlockEventData: {
    proposerAddress({proposer}) {
      return proposer;
    },
    proposer({proposer}, _args, {rpc}) {
      return accountState(rpc, proposer);
    },
  },
  PeerToPeerTransferScript: {
    receiverAddress({receiver}) {
      return receiver;
    },
    receiver({receiver}, _args, {rpc}) {
      return accountState(rpc, receiver);
    },
  },
  ReceivedPaymentEventData: {
    senderAddress({sender}) {
      return sender;
    },
    sender({sender}, _args, {rpc}) {
      return accountState(rpc, sender);
    },
  },
  SentPaymentEventData: {
    receiverAddress({receiver}) {
      return receiver;
    },
    receiver({receiver}, _args, {rpc}) {
      return accountState(rpc, receiver);
    },
  },
  Seed: {
    wallet(seed: LibraSeed) {
      return new LibraWallet(seed);
    },
  },
  Transaction: {
    data: mapAbstractType(TransactionDataType, 'transaction'),
  },
  UserTransactionData: {
    senderAddress({sender}) {
      return sender;
    },
    sender({sender}, _args, {rpc}) {
      return accountState(rpc, sender);
    },
    script: mapAbstractType(ScriptType, 'script'),
  },
  Wallet: {
    account(wallet: LibraWallet, {index = 0}) {
      return wallet.getAccount(index);
    },
  },
};
