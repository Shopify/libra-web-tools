/* eslint-env node */
/* eslint-disable no-process-env */

import express from 'express';

import {applyMiddleware, defaults} from '../src/server';

const {GRAPHQL_PATH: path = defaults.path, PORT} = process.env;
const port = Number(PORT) || 8000;
const [network] = process.argv.slice(2);

const app = express();

app.get('/services/ping', (_req, res) => res.json('OK'));
app.get('/', (_req, res) => res.redirect(path));

applyMiddleware(app, {network, path});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀  GraphQL playground running at http://localhost:${port}${path}`,
  );
});
