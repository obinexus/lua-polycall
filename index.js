'use strict';

/**
 * @obinexusltd/lua-polycall
 * Node.js entry point — exposes package metadata and CLI spawn helpers.
 *
 * This package distributes the LibPolyCall Lua binding.
 * All runtime execution routes through the polycall.exe binary
 * following the program-first adapter-pattern architecture.
 */

const path = require('path');
const { spawnSync, spawn } = require('child_process');

const PKG = require('./package.json');

/** Absolute path to the Lua source tree shipped with this package. */
const LUA_ROOT = path.join(__dirname, 'polycall');

/** Absolute path to the CLI entry script. */
const BIN_PATH = path.join(__dirname, 'bin', 'lua-polycall');

/**
 * Package metadata.
 * @type {{ name: string, version: string, protocolVersion: string, luaRoot: string, binPath: string }}
 */
const info = {
  name: PKG.name,
  version: PKG.version,
  protocolVersion: '1.0',
  architecturePattern: 'adapter',
  runtimeDependency: 'polycall.exe',
  luaRoot: LUA_ROOT,
  binPath: BIN_PATH,
};

/**
 * Spawn the lua-polycall CLI synchronously.
 *
 * @param {string[]} args  - CLI arguments (e.g. ['info'], ['test', '--verbose'])
 * @param {object}  [opts] - Options forwarded to spawnSync (cwd, env, etc.)
 * @returns {{ status: number|null, stdout: string, stderr: string }}
 */
function runSync(args = [], opts = {}) {
  const result = spawnSync('lua', [BIN_PATH, ...args], {
    encoding: 'utf8',
    ...opts,
  });
  return {
    status: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

/**
 * Spawn the lua-polycall CLI asynchronously.
 *
 * @param {string[]} args  - CLI arguments
 * @param {object}  [opts] - Options forwarded to spawn
 * @returns {import('child_process').ChildProcess}
 */
function run(args = [], opts = {}) {
  return spawn('lua', [BIN_PATH, ...args], {
    stdio: 'inherit',
    ...opts,
  });
}

module.exports = { info, run, runSync, LUA_ROOT, BIN_PATH };
