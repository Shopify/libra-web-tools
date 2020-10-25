# `@shopify/libra-rpc-graphql-server`

[![Build Status](https://travis-ci.org/Shopify/web-tools.svg?branch=master)](https://travis-ci.org/Shopify/web-tools)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md) [![npm version](https://badge.fury.io/js/%40shopify%2Flibra-rpc-graphql-server.svg)](https://badge.fury.io/js/%40shopify%2Flibra-rpc-graphql-server.svg)

Libra GraphQL Playground server

## Installation

```bash
$ yarn add @shopify/libra-rpc-graphql-server
```

## Usage

You can build a new express server by using `createSchema` and `createContext` from [`@shopify/libra-rpc-graphql`](https://github.com/Shopify/libra-web-tools/blob/master/packages/libra-rpc-graphql)

```tsx
/* eslint-env node */
/* eslint-disable no-process-env */

import express from 'express';

import {
  createContext,
  createSchema,
  LibraNetwork,
} from '@shopify/libra-rpc-graphql';
import {
  applyMiddleware,
  createServer,
  defaults,
} from '@shopify/libra-rpc-graphql-server';

const port = 8080;
const path = defaults.path;
const app = applyMiddleware(
  createServer(createSchema(), {
    context: createContext(LibraNetwork.Testnet),
    path,
    tabs: {minter: true},
  }),
);

app.listen(port, () => {
  console.log(
    `🚀  GraphQL playground running at http://localhost:${port}${path}`,
  );
});
```
