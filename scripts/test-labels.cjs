const path = require('node:path');
const Module = require('node:module');
const { buildSync } = require('esbuild');
global.localStorage = { getItem: () => null, setItem: () => {} };
const root = path.resolve(__dirname, '..');
const result = buildSync({
    stdin: { contents: "import './tests/labels.test';", resolveDir: root, loader: 'ts' },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: 'node20',
    packages: 'external',
    write: false,
});
const filename = path.join(root, 'tests/labels.compiled.cjs');
const compiled = new Module(filename, module);
compiled.filename = filename;
compiled.paths = Module._nodeModulePaths(path.dirname(filename));
compiled._compile(result.outputFiles[0].text, filename);
