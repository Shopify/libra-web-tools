/* eslint-env node */
/* eslint-disable no-process-env */

import {startExpress} from '../src/server';

const {HOST: host, PORT} = process.env;
const [network] = process.argv.slice(2);

startExpress({host, port: Number(PORT) || undefined, network, tabs: true});
