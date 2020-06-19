import {LibraSeedPhrase} from '../../dist/src/LibraSeed';
import {LibraWallet} from '../../dist/src/LibraWallet';

describe('e2e', () => {
  it('can generate a wallet with a phrase', () => {
    const seed = LibraSeedPhrase.generate();
    const wallet = new LibraWallet(seed);

    expect(wallet.seed.phrase).toBe(seed.phrase);
  });

  it('can initialize a wallet from a key', () => {
    const key =
      '9992ee9735d81d37b121ed18c8948f5750e4d4c20e44e230d533b99db5be08c9';
    const wallet = LibraWallet.fromKeyOrPhrase({key});

    expect(wallet.seed.key).toBe(key);
  });
});
