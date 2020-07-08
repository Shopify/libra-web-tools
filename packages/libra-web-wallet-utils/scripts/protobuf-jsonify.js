/* eslint-disable no-console */
/* eslint-env node */

const {readFileSync, writeFileSync} = require('fs');

const {parse} = require('protobufjs');

if (process.argv.length < 3) {
  console.log('Usage: ', `${process.argv[0]} ${process.argv[1]} {sourcePath}`);
  process.exit(1);
}

function jsonify(sourcePath) {
  const targetPath = `${sourcePath}.json`;
  console.log(`${sourcePath} → ${targetPath}`);

  const protobufContent = readFileSync(sourcePath);
  const protobufJson = parse(protobufContent).root.toJSON();

  writeFileSync(targetPath, JSON.stringify(protobufJson, null, 2));
}

jsonify(process.argv[2]);
