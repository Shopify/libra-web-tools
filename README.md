[comment]: # (NOTE: This file is generated and should not be modify directly. Update `templates/ROOT_README.hbs.md` instead)
# libra-web-tools

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)
[![Build Status](https://travis-ci.com/Shopify/libra-web-tools.svg?branch=master)](https://travis-ci.com/github/Shopify/libra-web-tools)
[![codecov](https://codecov.io/gh/Shopify/libra-web-tools/branch/master/graph/badge.svg)](https://codecov.io/gh/Shopify/libra-web-tools)
[![Greenkeeper badge](https://badges.greenkeeper.io/Shopify/libra-web-tools.svg)](https://greenkeeper.io/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

A collection of web tooling for the Libra network.

These libraries compose together to help you create performant modern JS apps that you love to develop and test. These packages are developed primarily to be used on top of the stack we like best for our JS apps; Typescript for the flavor, React for UI, Apollo for data fetching, and Jest for tests. That said, you can mix and match as you like.

Some of these tools can be seen in action at the [Libra GraphQL Playground](https://libra-graphql-playground.shopifycloud.com/)

## Usage

The `libra-web-tools` repo is managed as a monorepo that is composed of many npm packages.
Each package has its own `README` and documentation describing usage.

### Quickstart

Using `dev` we can simply run `dev up && dev s` to get up and running, the GraphQL Playground will be available at http://localhost:8000/graphql

Without `dev` we can instead run `yarn && yarn start` to get up and running.

### Package Index

| package |     |     |
| ------- | --- | --- |
| libra-rpc-graphql | [directory](packages/libra-rpc-graphql) | [![npm version](https://badge.fury.io/js/%40shopify%2Flibra-rpc-graphql.svg)](https://badge.fury.io/js/%40shopify%2Flibra-rpc-graphql) |
| libra-rpc-graphql-server | [directory](packages/libra-rpc-graphql-server) | [![npm version](https://badge.fury.io/js/%40shopify%2Flibra-rpc-graphql-server.svg)](https://badge.fury.io/js/%40shopify%2Flibra-rpc-graphql-server) |
| libra-web-wallet-utils | [directory](packages/libra-web-wallet-utils) | [![npm version](https://badge.fury.io/js/%40shopify%2Flibra-web-wallet-utils.svg)](https://badge.fury.io/js/%40shopify%2Flibra-web-wallet-utils) |

## Want to contribute?

Check out our [Contributing Guide](./.github/CONTRIBUTING.md)

## Questions?

For Shopifolk, you can reach out to us in Slack in the `#libra-web` channel. For external inquiries, we welcome bug reports, enhancements, and feature requests via Github issues.

## License

MIT &copy; [Shopify](https://shopify.com/), see [LICENSE.md](LICENSE.md) for details.

<a href="http://www.shopify.com/"><img src="https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg" alt="Shopify" width="200" /></a>
