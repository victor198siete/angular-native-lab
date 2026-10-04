import { fireEvent, screen, userEvent } from '@ng-native/testing';
import { describe, expect, it, vi } from 'vitest';
import { MEMBERSHIP_API, TAKEN_EMAIL, type MembershipApi } from '../../core/membership.api.ts';
import { fakeStoreModules } from '../../shared/native-fakes.ts';
import { renderApp } from '../testing.ts';

async function openJoin(api?: MembershipApi) {
  const native = fakeStoreModules();
  const providers = [...native.providers, ...(api ? [{ provide: MEMBERSHIP_API, useValue: api }] : [])];
  await renderApp('join', providers);
  await screen.findByTestId('join-submit');
  return { native, user: userEvent.setup() };
}

async function fillValid(user: ReturnType<typeof userEvent.setup>, email = 'ana@example.com') {
  await user.type(screen.getByTestId('join-name'), 'Ana López');
  await user.type(screen.getByTestId('join-email'), email);
  await user.type(screen.getByTestId('join-phone'), '9981234567');
  await fireEvent(screen.getByTestId('join-terms'), 'change', { value: true });
}

describe('join the program', () => {
  it('validates as the person leaves a field, and marks the field invalid for CSS', async () => {
    const { user } = await openJoin();
    await user.type(screen.getByTestId('join-email'), 'not-an-email');

    expect(await screen.findByText("That email doesn't look right.")).toBeTruthy();
    // [data-invalid][data-touched] reaches the native view as the stylesheet's border colour.
    expect(screen.getByTestId('join-email').props).toMatchObject({ borderTopColor: expect.anything() });
    expect(JSON.stringify(screen.getByTestId('join-email').props)).toMatch(/190, ?18, ?60|#be123c/i);
    expect(screen.queryByTestId('join-name-error')).toBeNull();
    expect(JSON.stringify(screen.getByTestId('join-name').props)).not.toMatch(/190, ?18, ?60|#be123c/i);
  });

  it('submitting an empty form shows every error and calls nothing', async () => {
    const api = { join: vi.fn() };
    const { user, native } = await openJoin(api);
    await user.press(screen.getByTestId('join-submit'));

    expect(await screen.findByText('Enter your name.')).toBeTruthy();
    expect(screen.getByText('Enter your email.')).toBeTruthy();
    // The phone is optional: empty passes pattern().
    expect(screen.queryByTestId('join-phone-error')).toBeNull();
    expect(screen.getByText('Accept the terms to join.')).toBeTruthy();
    expect(api.join).not.toHaveBeenCalled();
    expect(native.haptics.notificationAsync).toHaveBeenCalledOnce();
  });

  it('a taken email comes back from the sign-up call as an error on the email field', async () => {
    const { user } = await openJoin();
    await fillValid(user, TAKEN_EMAIL);
    await user.press(screen.getByTestId('join-submit'));

    expect(await screen.findByText('Joining…')).toBeTruthy();
    expect(await screen.findByText('This email is already registered.', {}, { timeout: 3000 })).toBeTruthy();
    expect(screen.queryByTestId('join-success')).toBeNull();
  });

  it('a valid form joins, vibrates and welcomes the person by name', async () => {
    const api = { join: vi.fn(async () => ({ ok: true }) as const) };
    const { user, native } = await openJoin(api);
    await fillValid(user);
    await user.press(screen.getByTestId('join-submit'));

    expect(await screen.findByTestId('join-success')).toBeTruthy();
    expect(screen.getByText('Ana, your account is ready. Your first points are on the way.')).toBeTruthy();
    expect(api.join).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ana López', email: 'ana@example.com', phone: '9981234567', promotions: false }),
    );
    expect(native.haptics.notificationAsync).toHaveBeenCalled();
  });

  it('is reachable from the wallet', async () => {
    await renderApp(undefined, fakeStoreModules().providers);
    await userEvent.setup().press(await screen.findByTestId('wallet-join'));
    expect(await screen.findByTestId('join-submit')).toBeTruthy();
  });
});
