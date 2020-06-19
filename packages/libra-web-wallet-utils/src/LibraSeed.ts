import {
  generateSeedKey,
  generateSeedPhrase,
  SeedKeyOptions,
  SeedPhraseOptions,
} from './generators';

export class LibraSeed {
  public static generateKey(phrase?: string, options?: SeedKeyOptions) {
    return generateSeedKey(phrase, options).toString('hex');
  }

  constructor(public readonly key: string) {}
}

export class LibraSeedPhrase extends LibraSeed {
  public static generatePhrase(options?: SeedPhraseOptions) {
    return generateSeedPhrase(options);
  }

  public static generate(
    keyOptions?: SeedKeyOptions,
    options?: SeedPhraseOptions,
  ) {
    return new LibraSeedPhrase(
      LibraSeedPhrase.generatePhrase(options),
      keyOptions,
    );
  }

  constructor(public readonly phrase: string, keyOptions?: SeedKeyOptions) {
    super(LibraSeed.generateKey(phrase, keyOptions));
  }

  public get words() {
    return this.phrase.split(' ');
  }
}
