export function asUInt64LE(index: number | BigInt) {
  const buffer = Buffer.alloc(8);

  buffer.writeBigUInt64LE(BigInt(index));

  return buffer;
}
