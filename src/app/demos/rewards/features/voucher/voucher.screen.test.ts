import { screen, userEvent } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { MOCK_MEMBER, MOCK_MOVEMENTS, MOCK_REWARDS } from '../../core/mocks/index.ts';
import { fakeStoreModules } from '../../shared/native-fakes.ts';
import { voucherCode } from '../../shared/voucher-code.ts';
import { renderApp } from '../testing.ts';

const redeem = MOCK_MOVEMENTS.find((m) => m.type === 'redeem')!;
const code = voucherCode(redeem.id);

async function openVoucher(id = redeem.id) {
  const native = fakeStoreModules();
  const app = await renderApp(`voucher/${id}`, native.providers);
  return { native, app, user: userEvent.setup() };
}

describe('voucher screen', () => {
  it('shows the code as a QR, at full brightness, kept on and out of screenshots', async () => {
    const { native } = await openVoucher();

    expect(await screen.findByText(code)).toBeTruthy();
    expect(screen.getByTestId('voucher-qr')).toBeTruthy();
    expect(screen.getByText(redeem.description)).toBeTruthy();
    expect(native.brightness.set).toHaveBeenCalledWith(1);
    expect(native.keepAwake.activate).toHaveBeenCalledWith('voucher');
    expect(native.capture.preventScreenCaptureAsync).toHaveBeenCalledWith('voucher');
  });

  it('puts brightness, the screen and screenshots back when it closes', async () => {
    const { native, app } = await openVoucher();
    await screen.findByText(code);

    app.unmount();

    expect(native.brightness.restore).toHaveBeenCalled();
    expect(native.keepAwake.deactivate).toHaveBeenCalledWith('voucher');
    expect(native.capture.allowScreenCaptureAsync).toHaveBeenCalledWith('voucher');
  });

  it('copies the code with a light tap of haptics, and says so', async () => {
    const { native, user } = await openVoucher();
    await user.press(await screen.findByTestId('voucher-copy'));

    expect(native.clipboard.setStringAsync).toHaveBeenCalledWith(code);
    expect(native.haptics.selectionAsync).toHaveBeenCalled();
    expect(await screen.findByText('Copied')).toBeTruthy();
  });

  it('shares the code through the system sheet', async () => {
    const { native, user } = await openVoucher();
    await user.press(await screen.findByTestId('voucher-share'));

    expect(native.sharing.share).toHaveBeenCalledWith(
      expect.objectContaining({ message: `My code for ${redeem.description}: ${code}` }),
    );
  });

  it('warns when a screenshot is taken anyway', async () => {
    const { native } = await openVoucher();
    await screen.findByText(code);
    expect(screen.queryByTestId('voucher-screenshot')).toBeNull();

    native.takeScreenshot();

    expect(await screen.findByTestId('voucher-screenshot')).toBeTruthy();
  });

  it('says so for an id that is not a redemption', async () => {
    await openVoucher('nope');
    expect(await screen.findByTestId('voucher-missing')).toBeTruthy();
  });
});

describe('from a redemption to the counter', () => {
  it('a successful redeem vibrates and "Show at the counter" opens its code', async () => {
    const affordable = MOCK_REWARDS.find((r) => r.costPoints <= MOCK_MEMBER.points && (r.stock ?? 1) > 0)!;
    const native = fakeStoreModules();
    await renderApp(`reward/${affordable.id}`, native.providers);
    const user = userEvent.setup();

    await user.press(await screen.findByTestId('redeem-button'));
    await user.press(await screen.findByTestId('confirm-redeem'));
    await user.press(await screen.findByTestId('show-in-store', {}, { timeout: 3000 }));

    expect(native.haptics.notificationAsync).toHaveBeenCalledOnce();
    expect(await screen.findByTestId('voucher-qr')).toBeTruthy();
    expect(native.brightness.set).toHaveBeenCalledWith(1);
  });
});
