/* eslint-env node */
/* eslint-disable no-process-env */

import {
  applyMiddleware,
  createServer,
  defaults,
} from '@shopify/libra-rpc-graphql-server';

import {createContext, createSchema} from '../src/link';
import {LibraNetwork} from '../src/types';

const path = process.env.GRAPHQL_PATH || defaults.path;
const port = Number(process.env.PORT) || 8000;
const [staticNetwork = LibraNetwork.Testnet] = process.argv.slice(2);

const app = applyMiddleware(
  createServer(createSchema(), {
    tabs: {minter: true},
    context({
      req: {
        headers: {referer},
      },
    }) {
      const network =
        new URL(referer).searchParams.get('network') || staticNetwork;

      return createContext(network as string);
    },
  }),
);

app.get('/services/ping', (_req, res) => res.json('OK'));
app.get('/', (_req, res) => res.redirect(path));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀  GraphQL playground running at http://localhost:${port}${path}`,
  );
});
