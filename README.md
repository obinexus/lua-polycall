# @obinexusltd/lua-polycall

Protocol-compliant Lua binding for [LibPolyCall](https://github.com/obinexus/libpolycall-v1trial) — part of the OBINexus toolchain.

> **Architecture:** This binding acts as an **adapter** to the `polycall.exe` runtime. It does not execute user logic directly; all execution routes through the LibPolyCall binary following the program-first architecture paradigm.

---

## Installation

### Via npm (distributes the Lua sources)

```bash
npm install @obinexusltd/lua-polycall
```

### Via LuaRocks (installs the Lua modules)

```bash
luarocks install lua-polycall-1.0-1.rockspec
```

### Prerequisites

| Dependency | Version |
|---|---|
| Lua | `>= 5.3, < 5.5` |
| luasocket | `>= 3.0` |
| luasec | `>= 1.0` |
| lua-cjson | `>= 2.1` |
| polycall.exe | runtime binary (LibPolyCall v1) |

---

## Usage

### CLI

```bash
# After luarocks install or npm install -g
lua-polycall info
lua-polycall test --verbose
lua-polycall telemetry
lua-polycall --help
```

### Lua API

```lua
local polycall = require('polycall')

local client = polycall.new_client({
    polycall_host = "localhost",
    polycall_port = 8084,
})

local ok, err = client:connect()
if not ok then error(err) end

local ok, err = client:authenticate({
    username = "user",
    api_key  = "your-api-key",
})
if not ok then error(err) end

local result, err = client:execute_operation("my_operation", { key = "value" })

client:shutdown()
```

### Node.js helper (spawn from JS)

```js
const { runSync, run } = require('@obinexusltd/lua-polycall');

// Synchronous
const { status, stdout } = runSync(['info']);
console.log(stdout);

// Async (inherits stdio)
run(['test', '--verbose']);
```

---

## Module structure

```
polycall/
  init.lua                  ← main require('polycall') entry
  core/
    binding.lua             ← client factory & lifecycle
    protocol.lua            ← protocol handler
    state.lua               ← finite-state machine
    telemetry.lua           ← silent protocol observer
    auth.lua                ← zero-trust auth
  config/
    manager.lua
    validator.lua
  cli/
    main.lua                ← full CLI framework
    registry.lua            ← command registry
    commands/
      info.lua
      test.lua
      telemetry.lua
  utils/
    logger.lua
    validator.lua
    crypto.lua
  exceptions/
    protocol.lua
    connection.lua
  validators/
    setup.lua
    runtime.lua
    ssh.lua
bin/
  lua-polycall              ← CLI entry script (#!/usr/bin/env lua)
config/
  lua-polycall.conf
  lua.polycallrc
```

---

## Architecture

`lua-polycall` enforces the **adapter pattern**:

- The Lua layer translates calls into the LibPolyCall wire protocol.
- `polycall.exe` performs all business logic execution.
- Every state transition is validated by a finite automaton (`polycall.core.state`).
- Authentication follows a zero-trust model — credentials are cryptographically validated per request.
- A silent telemetry observer records protocol events for debugging without side effects.

---

## Development

```bash
# Run Lua module load check
npm test

# Lint with luacheck
npm run lint

# Install Lua modules via luarocks
npm run install:lua

# Run full test suite (requires busted)
busted --verbose
```

---

## Project

Part of the **OBINexus** engineering stack.  
Technical lead: Nnamdi Michael Okpala — OBINexusComputing  
License: MIT  
Issues: https://github.com/obinexus/lua-polycall/issues
