import {eddsa} from 'elliptic';

import {rawTransactionSalt} from './generators';
import {RawTransaction, SignedTransaction} from './proto';
import {asUInt64LE, BufferLike, getBuffer, sha3hash} from './utilities';

export enum LibraProgramArgumentType {
  U64 = 0,
  Address = 1,
  String = 2,
  ByteArray = 3,
}

export interface LibraProgramArgument {
  type: LibraProgramArgumentType;
  value: Buffer;
}

export interface LibraProgram {
  code: Buffer;
  arguments: LibraProgramArgument[];
}

export interface LibraTransferTransaction {
  senderAccount: Buffer;
  sequenceNumber: number;
  payload: LibraProgram;
  maxGasAmount: number;
  gasUnitPrice: number;
  expirationTime: number;
}

export interface SignedRawTransaction {
  rawTxnBytes: Buffer;
  senderPublicKey: Buffer;
  senderSignature: Buffer;
}

// base64 encoded binary for the compiled peer_to_peer.move script
// see: https://developers.libra.org/docs/run-move-locally#compile-and-publish-move-modules (for compilation)
// similar to the script in https://github.com/libra/libra/blob/master/language/stdlib/transaction_scripts/peer_to_peer.move
// for more details
// see: https://github.com/libra/libra/blob/master/language/stdlib/transaction_scripts/doc/peer_to_peer.md
export const p2pTranasctionCode =
  'TElCUkFWTQoBAAcBSgAAAAQAAAADTgAAAAYAAAAMVAAAAAYAAAANWgAAAAYAAAAFYAAAACkAAAAEiQAAACAAAAAHqQAAAA4AAAAAAAABAAIAAQMAAgACBAIAAwADAgQCBjxTRUxGPgxMaWJyYUFjY291bnQEbWFpbg9wYXlfZnJvbV9zZW5kZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAgEEAAwADAERAQAC';
// pre-compute the salt hash since we are just packing it into the wire format anyways
export const rawTransactionSaltHash = sha3hash(rawTransactionSalt);

export function generateTransferTransactionScript(
  amount: number | BigInt,
  address: BufferLike,
): LibraProgram {
  return {
    arguments: [
      {
        type: LibraProgramArgumentType.Address,
        value: getBuffer(address, {encoding: 'hex'}),
      },
      {
        type: LibraProgramArgumentType.U64,
        value: asUInt64LE(amount),
      },
    ],
    code: getBuffer(p2pTranasctionCode, {encoding: 'base64'}),
  };
}

export function generateTransferTransaction(
  amount: number | BigInt,
  receiverAddress: BufferLike,
  senderAddress: BufferLike,
  sequenceNumber: number,
  maxGasAmount = 1000000,
  gasUnitPrice = 0,
  expiration = 300,
): LibraTransferTransaction {
  return {
    senderAccount: getBuffer(senderAddress, {encoding: 'hex'}),
    sequenceNumber,
    payload: generateTransferTransactionScript(amount, receiverAddress),
    maxGasAmount,
    gasUnitPrice,
    expirationTime: Math.floor(new Date().getTime() / 1000) + expiration,
  };
}

export function encodeTransferTransaction(
  transaction: LibraTransferTransaction,
): Buffer {
  return Buffer.from(
    RawTransaction.encode(RawTransaction.create(transaction)).finish(),
  );
}

export function signRawTransaction(
  rawTxn: BufferLike,
  keyPair: eddsa.KeyPair,
): SignedRawTransaction {
  const rawTxnBytes = getBuffer(rawTxn, {encoding: 'hex'});

  return {
    rawTxnBytes,
    senderPublicKey: keyPair.getPublic(),
    senderSignature: keyPair
      .sign(sha3hash(rawTransactionSaltHash, rawTxnBytes))
      .toBytes(),
  };
}

export function encodeSignedTransaction(
  signedRawTransaction: SignedRawTransaction,
) {
  return Buffer.from(
    SignedTransaction.encode(
      SignedTransaction.create(signedRawTransaction),
    ).finish(),
  );
}

export function signTransferTrasaction(
  keyPair: eddsa.KeyPair,
  transaction: LibraTransferTransaction,
) {
  return encodeSignedTransaction(
    signRawTransaction(encodeTransferTransaction(transaction), keyPair),
  );
}

export function signTransactionData(
  keyPair: eddsa.KeyPair,
  toAddress: BufferLike,
  amount: number,
  sequenceNumber: number,
  maxGasAmount?: number,
  gasUnitPrice?: number,
  expiration?: number,
) {
  return encodeSignedTransaction(
    signRawTransaction(
      encodeTransferTransaction(
        generateTransferTransaction(
          amount,
          toAddress,
          sha3hash(keyPair.getPublic()),
          sequenceNumber,
          maxGasAmount,
          gasUnitPrice,
          expiration,
        ),
      ),
      keyPair,
    ),
  );
}
