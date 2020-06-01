import {Resolvers} from 'src/types';

import {EventDataType, ScriptType, TransactionDataType} from './types';
import {mapAbstractType, mapResolvers} from './utilities';

export const resolvers: Resolvers = {
  Query: mapResolvers({
    accountState: {
      method: 'get_account_state',
      mapArgs: ({account}) => [account],
    },
    accountTransaction: {
      method: 'get_account_transaction',
      mapArgs: ({account, sequence, includeEvents = false}) => [
        account,
        Number(sequence),
        includeEvents,
      ],
    },
    events: {
      method: 'get_events',
      mapArgs: ({key, start, limit}) => [key, start, limit],
    },
    metadata: {
      method: 'get_metadata',
    },
    transactions: {
      method: 'get_transactions',
      mapArgs: ({startVersion, limit, includeEvents = false}) => [
        Number(startVersion),
        Number(limit),
        includeEvents,
      ],
    },
  }),
  Mutation: {
    ...mapResolvers({
      submitTransaction: {
        method: 'submit',
        mapArgs: ({input: {data}}) => [data],
      },
    }),
    mint(
      _source,
      {input: {authKey, amountInMicroLibras, currencyCode}},
      {faucet},
    ) {
      return faucet(authKey, Number(amountInMicroLibras), currencyCode);
    },
  },

  Event: {
    data: mapAbstractType(EventDataType, 'data'),
  },
  Transaction: {
    data: mapAbstractType(TransactionDataType, 'transaction'),
  },
  UserTransactionData: {
    script: mapAbstractType(ScriptType, 'script'),
  },
};
