#!/usr/bin/env node
import { runHwp } from "./index.js";

const [cmd, ...rest] = process.argv.slice(2);

function usage() {
  console.log(`hwp-automation (low-level)\n\nCommands:\n  meta\n  call <MethodName> [--json-args '[1,"a",true]']\n  get <PropertyName>\n  set <PropertyName> <jsonValue>\n`);
}

function getFlag(name: string) {
  const i = rest.indexOf(name);
  if (i === -1) return undefined;
  const v = rest[i + 1];
  rest.splice(i, 2);
  return v;
}

(async () => {
  if (!cmd || cmd === 'help') return usage();

  if (cmd === 'meta') {
    console.log(await runHwp({ cmd: 'meta' }));
    return;
  }

  if (cmd === 'call') {
    const jsonArgs = getFlag('--json-args');
    const method = rest[0];
    if (!method) throw new Error('need method');
    const args = jsonArgs ? JSON.parse(jsonArgs) : [];
    console.log(await runHwp({ cmd: 'call', method, args }));
    return;
  }

  if (cmd === 'get') {
    const prop = rest[0];
    if (!prop) throw new Error('need prop');
    console.log(await runHwp({ cmd: 'get', prop }));
    return;
  }

  if (cmd === 'set') {
    const prop = rest[0];
    const valueRaw = rest.slice(1).join(' ');
    if (!prop) throw new Error('need prop');
    if (!valueRaw) throw new Error('need value');
    const value = JSON.parse(valueRaw);
    console.log(await runHwp({ cmd: 'set', prop, value }));
    return;
  }

  usage();
})();
