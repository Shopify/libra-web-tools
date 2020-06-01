import {
  generateSeedPhrase,
  generateSeedKey,
  SeedKeyOptions,
} from './generators';
import {LibraAccount} from './LibraAccount';

export class LibraWallet<Phrase = never> {
  public static generate(options?: SeedKeyOptions) {
    const phrase = generateSeedPhrase();

    return new LibraWallet<string>(
      generateSeedKey(phrase, options).toString('hex'),
      phrase,
    );
  }

  public readonly accounts: Record<number, LibraAccount> = {};

  constructor(
    public readonly seed: string,
    private readonly _phrase?: string,
  ) {}

  get phrase(): Phrase {
    return this._phrase as any;
  }

  getAccount(index: number) {
    if (this.accounts[index] == null) {
      this.accounts[index] = LibraAccount.fromSeed(this.seed, index);
    }

    return this.accounts[index];
  }

  toString() {
    Object.entries(this.accounts)
      .map(([index, account]) =>
        [`Account #${index}`, account.toString()].join('\n'),
      )
      .join('\n\n');
  }
}
