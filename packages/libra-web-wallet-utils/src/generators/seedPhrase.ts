import {generateMnemonic} from 'bip39';

export interface SeedPhraseOptions {
  strength?: number;
  rng?: (size: number) => Buffer;
  wordlist?: string[];
}

export function generateSeedPhrase({
  strength = 256,
  rng,
  wordlist,
}: SeedPhraseOptions = {}) {
  return generateMnemonic(strength, rng, wordlist);
}
