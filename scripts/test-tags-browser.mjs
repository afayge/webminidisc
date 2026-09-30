import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { build, loadConfigFromFile, mergeConfig } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.env.PUBLIC_URL = 'sandbox://app/';
const { config } = await loadConfigFromFile({ command: 'build', mode: 'production' }, path.join(root, 'vite.config.ts'));
// Keep production resolution, CommonJS transforms, and polyfills; no service
// worker or build artifacts are needed for this in-memory browser regression.
config.plugins = config.plugins.flat(Infinity).filter((plugin) => !plugin?.name?.includes('pwa'));
const result = await build(mergeConfig(config, {
    configFile: false,
    root,
    logLevel: 'error',
    build: {
        write: false,
        rollupOptions: {
            input: path.join(root, 'tests/tags-browser.ts'),
            output: { format: 'iife', inlineDynamicImports: true },
        },
    },
}));
// Supply Web APIs, never Node's process, require, or stream. This reproduces
// browser-bundle interoperability bugs which test-titles.cjs cannot detect.
const context = vm.createContext({
    console, File, Blob, ReadableStream, TextDecoder, TextEncoder,
    Uint8Array, ArrayBuffer, DataView, AbortSignal, AbortController,
    setTimeout, clearTimeout, queueMicrotask, performance, URL,
});
vm.runInContext(result.output.find((output) => output.type === 'chunk').code, context, { timeout: 5000 });
let timer;
try {
    const passed = await Promise.race([
        context.tagChecks,
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Browser tag checks hung')), 10_000); }),
    ]);
    for (const message of passed) console.log(`PASS ${message}`);
    console.log(`${passed.length} browser-bundle tag checks passed`);
} finally {
    clearTimeout(timer);
}
