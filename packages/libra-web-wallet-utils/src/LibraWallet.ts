import {SeedKeyOptions} from './generators';
import {LibraAccount} from './LibraAccount';
import {LibraSeed, LibraSeedPhrase} from './LibraSeed';

interface KeyOrPhrase {
  key?: string;
  phrase?: string;
}

export class LibraWallet<Seed extends LibraSeed = LibraSeed> {
  public static generate(keyOptions?: SeedKeyOptions) {
    return new LibraWallet(LibraSeedPhrase.generate(keyOptions));
  }

  public static fromKeyOrPhrase({
    key,
    phrase,
  }: KeyOrPhrase & {phrase: string}): LibraWallet<LibraSeedPhrase>;

  public static fromKeyOrPhrase({key, phrase}: KeyOrPhrase): LibraWallet;

  public static fromKeyOrPhrase({key, phrase}: KeyOrPhrase) {
    if (phrase) {
      return new LibraWallet(new LibraSeedPhrase(phrase));
    }

    return new LibraWallet(new LibraSeed(key || LibraSeed.generateKey()));
  }

  public readonly accounts: Record<number, LibraAccount> = {};

  constructor(public readonly seed: Seed) {}

  getAccount(index: number) {
    if (this.accounts[index] == null) {
      this.accounts[index] = LibraAccount.fromSeed(this.seed.key, index);
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
