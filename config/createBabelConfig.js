'use strict'

function createBabelConfig({ modules, isTestEnvironment = false }) {
  let presetEnv

  if (isTestEnvironment) {
    // ES features necessary for user's Node version
    presetEnv = [
      require.resolve('@babel/preset-env'),
      { targets: { node: 'current' } },
    ]
  } else {
    presetEnv = [
      require.resolve('@babel/preset-env'),
      {
        // Allow importing core-js in entrypoint and use browserlist to select polyfills
        useBuiltIns: 'entry',
        // Set the corejs version we are using to avoid warnings in console
        // This will need to change once we upgrade to corejs@3
        corejs: 3,
        modules: modules === 'es' ? false : modules,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
      },
    ]
  }

  return {
    presets: [
      presetEnv,
      [
        require.resolve('@babel/preset-react'),
        {
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
    ],
    plugins: [
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      [
        require.resolve('@babel/plugin-transform-destructuring'),
        {
          // Use loose mode for performance:
          // https://github.com/facebook/create-react-app/issues/5602
          loose: false,
          selectiveLoose: [
            'useState',
            'useEffect',
            'useContext',
            'useReducer',
            'useCallback',
            'useMemo',
            'useRef',
            'useImperativeHandle',
            'useLayoutEffect',
            'useDebugValue',
          ],
        },
      ],
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require.resolve('@babel/plugin-proposal-class-properties'),
        { loose: true },
      ],
      // Adds Numeric Separators
      require.resolve('@babel/plugin-proposal-numeric-separator'),
      // The following two plugins use Object.assign directly, instead of Babel's
      // extends helper. Note that this assumes `Object.assign` is available.
      // { ...todo, completed: true }
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        { loose: true, useBuiltIns: true },
      ],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          helpers: true,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
          useESModules: modules === 'es',
        },
      ],
      // Adds syntax support for import()
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      // Adds syntax support for optional chaining (?.)
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      // Adds syntax support for default value using ?? operator
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      isTestEnvironment &&
        // Transform dynamic import to require
        require.resolve('babel-plugin-dynamic-import-node'),
      // Adds syntax support for namespace export (export * as ns from 'mod';)
      require.resolve('@babel/plugin-proposal-export-namespace-from'),
      // Adds syntax support for default export (export { default } from 'mod';)
      require.resolve('@babel/plugin-proposal-export-default-from'),
    ].filter(Boolean),
  }
}

module.exports = createBabelConfig
