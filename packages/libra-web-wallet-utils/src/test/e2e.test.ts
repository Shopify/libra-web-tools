import {LibraWallet} from '../../dist/src/LibraWallet';

describe('e2e', () => {
  it('can generate a wallet with a phrase', () => {
    const wallet = LibraWallet.generate();

    expect(wallet.phrase).toBeDefined();
  });

  it('can initialize a wallet from a seed', () => {
    const seed =
      '9992ee9735d81d37b121ed18c8948f5750e4d4c20e44e230d533b99db5be08c9';
    const wallet = new LibraWallet(seed);

    expect(wallet.seed).toBe(seed);
  });
});
