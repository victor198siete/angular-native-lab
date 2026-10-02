import { describe, expect, it } from 'vitest';
import { chooseLanguage } from './language.ts';

describe('chooseLanguage', () => {
  it('prefers the in-app choice over the device languages', () => {
    expect(chooseLanguage(['en', 'es'])).toBe('en');
  });

  it('follows the device when there is no in-app choice', () => {
    expect(chooseLanguage([null, 'es', 'en'])).toBe('es');
  });

  it('skips languages the app does not have', () => {
    expect(chooseLanguage([null, 'de', 'es'])).toBe('es');
  });

  it('falls back to English', () => {
    expect(chooseLanguage([null, 'de', 'fr'])).toBe('en');
  });
});
