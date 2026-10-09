// Defines the $localize global. It must run before any component module is evaluated.
import '@angular/localize/init';
// Expo's runtime: its fetch, whose response streams a body, and URL, TextDecoderStream and
// structuredClone. Metro runs it before this file only when something imports it, and nothing
// else does in a release build, which would then get React Native's fetch, with no body.
import 'expo';
import { AppRegistry, Image, Platform, processColor } from 'react-native';
import { mount } from '@ng-native/platform';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { currentConditions, deviceTokens, watchConditions } from '@ng-native/device';
import { getFabricUIManager, registerPlatformComponents } from '@ng-native/fabric';
import { withInterceptors } from '@angular/common/http';
import { withComponentInputBinding } from '@angular/router';
import { provideNativeRouter, withHeaderDefaults, withTabDefaults } from '@ng-native/router';
import tailwind from '../.angular-native/app.tailwind.js';
import { provideLocalization } from './app/core/i18n/localization.ts';
import { routes } from './app/app.routes.ts';
import { authInterceptor } from './app/demos/login/core/auth.interceptor.ts';
import { mockAuthServer } from './app/demos/login/core/mock-auth/mock-auth.server.ts';
import { App } from './app/app.ts';

registerPlatformComponents(Platform.OS);

AppRegistry.registerRunnable('main', ({ rootTag }: { rootTag: number | string }) => {
  const app = mount(Number(rootTag), App, getFabricUIManager(), {
    // Colours, as the integers the platform wants.
    processColor,
    // Tailwind utilities, compiled by `withTailwind` in metro.config.js.
    globalStyles: tailwind,
    providers: [
      provideLocalization(),
      // HttpClient for the Login demo. The mock auth server is the last interceptor, so the request
      // goes through the real client and the auth interceptor, and only the network hop is faked.
      provideNativeHttpClient(withInterceptors([authInterceptor, mockAuthServer])),
      provideNativeRouter(
        routes,
        withComponentInputBinding(),
        // Native chrome follows the palette in src/styles.css; the function re-runs when the scheme changes.
        withHeaderDefaults((scheme) => ({
          backgroundColor: scheme === 'dark' ? '#07080D' : '#F5F3EE',
          titleColor: scheme === 'dark' ? '#F4F5FA' : '#12131A',
          largeTitleColor: scheme === 'dark' ? '#F4F5FA' : '#12131A',
          color: '#F43F5E',
          userInterfaceStyle: scheme,
          hideShadow: true,
        })),
        withTabDefaults((scheme) => ({
          tintColor: '#F43F5E',
          backgroundColor: scheme === 'dark' ? '#0B0D14' : '#FBFAF7',
        })),
      ),
    ],
    // What `@media` resolves against. Without it every media query is false and a responsive
    // layout renders as its smallest case.
    conditions: currentConditions(),
    // Values only the device knows - the hairline width, which is a third of a point on a 3x
    // screen. Without it `1px` is what you get, and that is a visibly fat divider.
    tokens: deviceTokens(),
    // Turns a `require('./x.png')` into something native can load. Without it images are blank.
    resolveAssetSource: (value) => Image.resolveAssetSource(value as never),
  });

  // Re-resolves the conditions when the device rotates or the theme changes. A rotation dirties
  // no component and no binding, so without this nothing re-renders and `dark:` stops following
  // the system switch.
  watchConditions(app.engine);
});
