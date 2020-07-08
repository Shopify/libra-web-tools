/* eslint-env node */
/* eslint-disable no-console */

import {
  generateKeyPair,
  generateSeedKey,
  generateSeedPhrase,
  keyPairFromSecret,
} from '../src/generators';
import {
  generateTransferTransaction,
  LibraProgramArgumentType,
  signTransferTrasaction,
} from '../src/transaction';
import {sha3hash} from '../src/utilities/sha3hash';

const runner = process.argv.slice(0, 2).join(' ');
const [command = 'help', ...args] = process.argv.slice(2);

function help() {
  const actions = [
    'seed[:{phrase|words|key|all}]',
    'account[:{seed|secret|public|authKey|address|all}] [seed|...phrase] [index]',
    'transfer[:payload|debug] {fromSecretKey} {toAddress} {amount} {sequenceNumber}',
  ];
  console.log(
    `
Usage: ${runner} {action}[:format] [...args]

Actions:\n${actions.map((line) => `  ${line}`).join('\n')}`.trim(),
  );
  process.exit(0);
}

export function seed() {
  const phrase = generateSeedPhrase();
  const key = generateSeedKey(phrase).toString('hex');
  const all = [`Phrase: ${phrase}`, `   Key: ${key}`].join('\n');

  return {
    phrase,
    words: phrase.split(' ').join(','),
    key,
    all,
    default: all,
  };
}

export function account(args: string[] = []) {
  function parseSeed() {
    if (args.length <= 2) {
      const [seed = generateSeedKey().toString('hex'), index = '0'] = args;

      return {seed, index: Number(index)};
    }

    const index = Number(args[args.length - 1]);
    const hasIndex = !isNaN(index);
    const phrase = args.slice(0, hasIndex ? -1 : args.length).join(' ');
    const seed = generateSeedKey(phrase).toString('hex');

    return {
      phrase,
      seed,
      index: hasIndex ? index : 0,
    };
  }

  const {index, phrase, seed} = parseSeed();
  const keyPair = generateKeyPair(seed, index);
  const authKey = sha3hash(keyPair.getPublic()).toString('hex');

  const details = {
    phrase,
    seed,
    index,
    secret: keyPair.getSecret('hex'),
    public: keyPair.getPublic('hex'),
    authKey,
    address: authKey.slice(-32),
    authKeyPrefix: authKey.slice(0, 32),
  };
  const all = [
    `         Phrase: ${phrase || 'N/A'}`,
    `           Seed: ${seed}`,
    `          Index: ${index}`,
    `         Secret: ${details.secret}`,
    `         Public: ${details.public}`,
    `       Auth Key: ${details.authKey}`,
    `        Address: ${details.address}`,
    `Auth Key Prefix: ${details.authKeyPrefix}`,
  ].join('\n');

  return {
    ...details,
    all,
    default: all,
  };
}

export function transfer([from, to, amount, sequence]: string[]) {
  const keyPair = keyPairFromSecret(from);
  const tx = generateTransferTransaction(
    Number(amount),
    to,
    sha3hash(keyPair.getPublic()),
    Number(sequence),
  );
  const payload = [
    '',
    '***************',
    '*** WARNING *** transaction signing is not functioning correctly',
    '***************',
    '',
    signTransferTrasaction(keyPair, tx).toString('hex'),
  ].join('\n');

  const debug = JSON.stringify(
    {
      ...tx,
      senderAccount: tx.senderAccount.toString('hex'),
      payload: {
        arguments: tx.payload.arguments.map(({type, value}) => ({
          type: LibraProgramArgumentType[type],
          value: value.toString('hex'),
        })),
        code: tx.payload.code.toString('hex'),
      },
      expirationTime: new Date(tx.expirationTime * 1000),
    },
    null,
    2,
  );

  const all = [`payload: ${payload}`, `debug: ${debug}`].join('\n');

  return {
    debug,
    payload,
    all,
    default: all,
  };
}

const [, action = 'help', format = undefined] = /^(\w+)(?::(\w+))?$/.exec(
  command,
);

switch (action) {
  case 'seed': {
    console.log(seed()[format || 'default']);
    break;
  }
  case 'account': {
    console.log(account(args)[format || 'default']);
    break;
  }
  case 'transfer': {
    console.log(transfer(args)[format || 'default']);
    break;
  }
  default: {
    help();
    break;
  }
}
