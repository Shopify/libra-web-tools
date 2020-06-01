import {Resolvers} from 'src/types';

import {mapResolvers} from './utilities';

export const resolvers: Resolvers = {
  Query: mapResolvers({
    accountState: {
      method: 'get_account_state',
      mapArgs: ({account}) => [account],
    },
    metadata: {
      method: 'get_metadata',
    },
  }),
};
