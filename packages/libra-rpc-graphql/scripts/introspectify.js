/* eslint-disable no-console */
/* eslint-env node */

// this is a special node "script" to build a JSON file out of the SDL schema
// we use this so we can natively import the JSON module instead of requiring a
// loader to import the schema.graphql file.
// run `node introspectify.js` to generate the schema.json file
// NOTE: this also emits the SDL schema.graphql file to the dist root

const {readFileSync, writeFileSync} = require('fs');
const {resolve} = require('path');

const {convertSchema, SchemaFormat} = require('../dist/src/graphql/utilities');

if (process.argv.length < 3) {
  console.log(
    'Usage: ',
    process.argv[0],
    process.argv[1],
    '{targetPath} [{targetPath}, ...]',
  );
  process.exit(1);
}

const sourcePath = resolve(__dirname, '../src/graphql/schema.graphql');
const sourceContent = readFileSync(sourcePath, 'utf-8');
const introspectionContent = JSON.stringify(
  convertSchema(sourceContent, SchemaFormat.Introspection),
  null,
  2,
);

for (const path of process.argv.slice(2)) {
  const targetPath = resolve(process.cwd(), path);
  const isJson = targetPath.endsWith('.json');

  console.log(`${sourcePath} → ${targetPath}`);

  writeFileSync(targetPath, isJson ? introspectionContent : sourceContent);
}
