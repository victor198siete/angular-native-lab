const { getDefaultConfig } = require('expo/metro-config');
const { withAngularNative } = require('@ng-native/metro/config.cjs');

// Registers the transformer that compiles Angular ahead of time, compiles each component's CSS
// into the sheet the engine reads, and adds the polyfills Angular needs before `@angular/core`
// is first evaluated. No options: the framework packages are ordinary dependencies here.
module.exports = withAngularNative(getDefaultConfig(__dirname));
