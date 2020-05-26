import {Resolvers} from 'src/types';

import {accountState} from './accountState';
import {metadata} from './metadata';
import {mapResolvers} from './utilities';

export const resolvers: Resolvers = {
  Query: mapResolvers({
    accountState,
    metadata,
  }),
  Mutation: mapResolvers({}),
};
