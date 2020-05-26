import {ResolverInfo} from 'src/types';

export interface Args {
  account: string;
}

export const accountState: ResolverInfo<Args> = {
  method: 'get_account_state',
  mapArgs({account}) {
    return [account];
  },
};
