// Fails when a translation file and the extracted source messages disagree: a missing or extra
// id, or a {$placeholder} that does not match. Runs in CI next to typecheck and tests.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../src/locale/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, dir), 'utf8')).translations;
const placeholders = (text) => (text.match(/\{\$\w+\}/g) ?? []).sort().join(' ');

const source = read('messages.json');
let failed = false;
for (const file of readdirSync(dir).filter((f) => /^messages\.[\w-]+\.json$/.test(f))) {
  const target = read(file);
  for (const id of Object.keys(source)) {
    if (!(id in target)) { console.error(`${file}: missing "${id}"`); failed = true; }
    else if (placeholders(source[id]) !== placeholders(target[id])) {
      console.error(`${file}: placeholders differ in "${id}"`); failed = true;
    }
  }
  for (const id of Object.keys(target)) {
    if (!(id in source)) { console.error(`${file}: "${id}" is not in messages.json`); failed = true; }
  }
}
if (failed) process.exit(1);
console.log('translations match messages.json');
