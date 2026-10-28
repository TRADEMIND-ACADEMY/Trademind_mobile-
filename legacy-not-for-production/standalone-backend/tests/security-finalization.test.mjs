import assert from 'node:assert/strict';
import fs from 'node:fs';

const server = fs.readFileSync(new URL('../server.ts', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const netlifyFn = fs.readFileSync(new URL('../netlify/functions/api.ts', import.meta.url), 'utf8');
const db = fs.readFileSync(new URL('../server/db.ts', import.meta.url), 'utf8');

assert.match(server, /crypto\.scryptSync\(password, salt, 64\)/, 'new passwords use scrypt');
assert.match(server, /PASSWORD_RESET_NOT_CONFIGURED/, 'password recovery does not claim false success');
assert.doesNotMatch(server, /allUsers\.length\s*===\s*0\s*\|\|\s*email\.toLowerCase\(\)\.includes/, 'public signup cannot auto-grant OWNER');
assert.match(server, /role:\s*'USER'/, 'public registration creates USER');
assert.match(pkg.scripts.build, /build:server.*vite build/, 'production build generates server bundle before Vite');
assert.match(pkg.scripts['build:server'], /esbuild server\.ts.*outfile=server\.js/, 'server bundle script outputs server.js');
assert.match(netlifyFn, /from '\.\.\/\.\.\/server\.js'/, 'Netlify function imports generated server bundle');
assert.match(db, /\/tmp\/trademind_data/, 'current serverless JSON storage uses temporary storage and needs durable DB before production');
console.log('PASS: finalization security/config static checks (8 assertions).');
