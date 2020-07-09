/* eslint-disable no-process-env */
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest =
  process.env.IS_STAGING === 'test' || Boolean(process.env.JEST_WORKER_ID);
export const isDevelopment = !isProduction && !isTest;
