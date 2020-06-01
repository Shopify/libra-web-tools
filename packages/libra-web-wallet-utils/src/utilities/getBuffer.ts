export type BufferLike = Buffer | string | Uint8Array;

export interface GetBufferOptions {
  encoding?: BufferEncoding;
  normalizeForm?: string;
}

export function getBuffer(
  input: BufferLike,
  options?: GetBufferOptions,
): Buffer;
export function getBuffer(
  input?: BufferLike,
  options?: GetBufferOptions,
): Buffer | undefined;
export function getBuffer(
  input?: BufferLike,
  {encoding = 'utf8', normalizeForm = 'NFKD'}: GetBufferOptions = {},
) {
  if (!input || Buffer.isBuffer(input)) {
    return input;
  }

  if (typeof input === 'string') {
    return Buffer.from(input.normalize(normalizeForm), encoding);
  }

  // assume byte array
  return Buffer.from(input);
}
