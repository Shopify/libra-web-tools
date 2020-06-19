// this is a hack until we can use yarn workspaces foreach --include libra-rpc-graphql

const {execSync} = require('child_process');

const projects = ['libra-rpc-graphql', 'libra-web-wallet-utils'];

for (const project of projects) {
  execSync(`yarn --cwd packages/${project} run postbuild`, {stdio: 'inherit'});
}
