

# NxNextConfigBug

This project was generated to verify the existence of a config bug between Nrwl Nx and Next.js.

## Bug
### One
Per https://nx.dev/latest/react/next/build#nextconfig as a user I expect adding `"nextConfig": "next.config.js"` to my configuration should cause Nx to use the custom Next.js config at `apps/nx-next-config-bug/next.config.js`

### Two
Generated `next.config.js` is not correctly formatted for consumption. I discovered this issue after hard coding the config path to be fully qualified.
`TypeError: userNextConfig is not a function`
```
# Default code (throws error, never launches next build)
module.exports = withNx({});
```

```
# Modified code (launches next build, fails because of unrelated missing svg loader)
module.exports = (phase, config, options ) => withNx({});
```
## Debugging
### Tl;Dr
I think bug one is somewhere near https://github.com/nrwl/nx/blob/master/packages/next/src/utils/config.ts#L130

I think bug two is related and is caused by this method execution https://github.com/nrwl/nx/blob/master/packages/next/src/utils/config.ts#L145

### Environment
```
 NX  Report complete - copy this into the issue template

  Node : 10.16.3
  OS   : darwin x64
  npm  : 6.9.0

  nx : Not Found
  @nrwl/angular : Not Found
  @nrwl/cli : 11.5.2
  @nrwl/cypress : 11.5.2
  @nrwl/devkit : 11.5.2
  @nrwl/eslint-plugin-nx : 11.5.2
  @nrwl/express : Not Found
  @nrwl/jest : 11.5.2
  @nrwl/linter : 11.5.2
  @nrwl/nest : Not Found
  @nrwl/next : 11.5.2
  @nrwl/node : Not Found
  @nrwl/react : 11.5.2
  @nrwl/schematics : Not Found
  @nrwl/tao : 11.5.2
  @nrwl/web : 11.5.2
  @nrwl/workspace : 11.5.2
  @nrwl/storybook : 11.5.2
  @nrwl/gatsby : Not Found
  typescript : 4.0.7
```

#### How this was set up
- `npx create-nx-workspace@latest nx-next-config-bug`
- `cd nx-next-config-bug`
- `nx build` <= ( Works )
- Add `"nextConfig": "next.config.js"` to `workspaceJson.projects.'nx-next-config-bug'.targets.build.options`
- Add console.log to `next.config.js` (to verify it's executed, it never runs)
- `nx build` <= ( fails)


## Logs
### Nx Build
```
❯ nx-next-config-bug (main) ✘ nx build
nx run nx-next-config-bug:build
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db
Cannot find module 'next.config.js'
```
### Nx Build Verbose
```
nx build --verbose
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db
Cannot find module 'next.config.js'
Error: Cannot find module 'next.config.js'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:636:15)
    at Function.Module._load (internal/modules/cjs/loader.js:562:25)
    at Module.require (internal/modules/cjs/loader.js:692:17)
    at Module.require (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/tao/src/compat/compat.js:7:40)
    at require (internal/modules/cjs/helpers.js:25:18)
    at Object.prepareConfig (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/next/src/utils/config.js:85:11)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/next/src/executors/build/build.impl.js:19:33
    at Generator.next (<anonymous>)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:117:75
    at new Promise (<anonymous>)
    at Object.__awaiter (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:113:16)
    at buildExecutor (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/next/src/executors/build/build.impl.js:17:20)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/tao/src/commands/run.js:122:23
    at Generator.next (<anonymous>)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:117:75
    at new Promise (<anonymous>)
```

### Nx build (modified) [bug 2]
Delta: Replace `next.config.js` with fully qualified file path to the location

Note: The module is found when referenced this way but is not correct.
```
nx run nx-next-config-bug:build --verbose
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db
userNextConfig is not a function
TypeError: userNextConfig is not a function
    at Object.prepareConfig (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/next/src/utils/config.js:94:12)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/next/src/executors/build/build.impl.js:19:33
    at Generator.next (<anonymous>)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:117:75
    at new Promise (<anonymous>)
    at Object.__awaiter (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:113:16)
    at buildExecutor (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/next/src/executors/build/build.impl.js:17:20)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/tao/src/commands/run.js:122:23
    at Generator.next (<anonymous>)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:117:75
    at new Promise (<anonymous>)
    at Object.__awaiter (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:113:16)
    at runExecutorInternal (/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/tao/src/commands/run.js:103:20)
    at Object.<anonymous(/Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/@nrwl/tao/src/commands/run.js:191:54)
    at Generator.next (<anonymous>)
    at /Users/jgibson/src/prototypes/nx-next-config-bug/node_modules/tslib/tslib.js:117:75
```
