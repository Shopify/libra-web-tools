/* eslint-env node */
/* eslint-disable no-process-env */

import express from 'express';

import {start} from '../src/server';

const {HOST: host, PORT} = process.env;
const [network] = process.argv.slice(2);
const app = express();

app.get('/services/ping', (_req, res) => res.json('OK'));

start({app, host, port: Number(PORT) || undefined, network, tabs: true});
