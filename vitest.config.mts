import { ngNative } from '@ng-native/testing/vitest';
import { defineConfig } from 'vitest/config';

// Compiles Angular for the tests the way Metro compiles it for the app. Tests run in Node against
// a fake of the native side: no simulator, no device.
export default defineConfig({
  plugins: [ngNative()],
  // The $localize global, as src/main.ts loads it in the app; then a longer default wait for findBy.
  test: { setupFiles: ['@angular/localize/init', './src/test-setup.ts'] },
});
