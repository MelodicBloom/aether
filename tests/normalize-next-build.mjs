import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

const [inputArg = '.next', outputArg = 'artifacts/build-normalized.sha256'] = process.argv.slice(2);
const root = resolve(inputArg);
const output = resolve(outputArg);
const workspace = process.cwd();
const buildIdPath = resolve(root, 'BUILD_ID');
let buildId = '';

try {
  buildId = (await readFile(buildIdPath, 'utf8')).trim();
} catch {
  // A missing BUILD_ID is valid for some Next build modes.
}

const VOLATILE_JSON_KEYS = new Set([
  'previewModeId',
  'previewModeSigningKey',
  'previewModeEncryptionKey',
  'encryptionKey',
]);

const excluded = (relativePath) =>
  relativePath === 'BUILD_ID' ||
  relativePath === 'trace' ||
  relativePath.endsWith('.trace') ||
  relativePath.startsWith(`cache${sep}`) ||
  relativePath.startsWith('cache/');

const files = await walk(root);
const entries = [];

for (const filePath of files) {
  const relativePath = relative(root, filePath);
  if (excluded(relativePath)) continue;

  const normalizedPath = normalizeText(relativePath.split(sep).join('/'));
  const source = await readFile(filePath);
  const normalizedContent = normalizeBuffer(source, filePath);
  const digest = createHash('sha256').update(normalizedContent).digest('hex');
  entries.push(`${digest}  ${normalizedPath}`);
}

entries.sort((left, right) => left.localeCompare(right));
await writeFile(output, `${entries.join('\n')}\n`, 'utf8');

async function walk(directory) {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) results.push(...(await walk(path)));
    else if (entry.isFile()) results.push(path);
  }
  return results;
}

function normalizeBuffer(buffer, filePath) {
  if (buffer.includes(0)) return buffer;

  let text;
  try {
    text = buffer.toString('utf8');
  } catch {
    return buffer;
  }

  if (filePath.endsWith('.json')) {
    try {
      return Buffer.from(canonicalJson(normalizeJson(JSON.parse(text))), 'utf8');
    } catch {
      // Continue with conservative text normalization for non-standard JSON.
    }
  }

  return Buffer.from(normalizeText(text), 'utf8');
}

function normalizeJson(value) {
  if (Array.isArray(value)) return value.map(normalizeJson);
  if (value === null || typeof value !== 'object') {
    return typeof value === 'string' ? normalizeText(value) : value;
  }

  const normalized = {};
  for (const [key, child] of Object.entries(value)) {
    normalized[key] = VOLATILE_JSON_KEYS.has(key)
      ? `<VOLATILE:${key}>`
      : normalizeJson(child);
  }
  return normalized;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value === null || typeof value !== 'object') return JSON.stringify(value);

  const entries = Object.entries(value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, child]) => `${JSON.stringify(key)}:${canonicalJson(child)}`);
  return `{${entries.join(',')}}`;
}

function normalizeText(value) {
  let normalized = value;
  if (buildId) normalized = normalized.split(buildId).join('<BUILD_ID>');
  normalized = normalized.split(workspace).join('<WORKSPACE>');
  normalized = normalized.split(workspace.replaceAll('\\', '/')).join('<WORKSPACE>');
  return normalized;
}
