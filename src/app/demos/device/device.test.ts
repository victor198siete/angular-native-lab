import { SafeArea } from '@ng-native/device';
import { screen, userEvent, within } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../rewards/features/testing.ts';
import { distanceMeters, formatAddress } from './core/geo.ts';
import { fakeColorScheme, fakeLocation, fakeNetwork, fakeScreen, MADRID, permissions, sizes } from './testing.ts';

interface Options {
  scheme?: ReturnType<typeof fakeColorScheme>;
  display?: ReturnType<typeof fakeScreen>;
  network?: ReturnType<typeof fakeNetwork>;
  location?: ReturnType<typeof fakeLocation>;
}

async function open(options: Options = {}) {
  const scheme = options.scheme ?? fakeColorScheme();
  const display = options.display ?? fakeScreen();
  const network = options.network ?? fakeNetwork();
  const location = options.location ?? fakeLocation();
  const view = await renderApp('device', [scheme.provider, display.provider, network.provider, location.provider]);
  await screen.findByTestId('device-heading');
  return { scheme, display, network, location, view, user: userEvent.setup() };
}

/** The text inside one card; "Yes" and "No" repeat across cards, so queries are scoped to one. */
const card = (id: string) => within(screen.getByTestId(id));

describe('device screen', () => {
  it('renders the four cards', async () => {
    await open();
    for (const id of ['card-appearance', 'card-safe-area', 'card-network', 'card-location']) {
      expect(screen.getByTestId(id)).toBeTruthy();
    }
  });
});

describe('theme and screen card', () => {
  it('follows the color scheme', async () => {
    const { scheme } = await open();
    expect(await screen.findByText('Light')).toBeTruthy();
    scheme.set('dark');
    expect(await screen.findByText('Dark')).toBeTruthy();
  });

  it('follows rotation and compact width', async () => {
    const { display } = await open();
    expect(await screen.findByText('393 x 852')).toBeTruthy();
    expect(screen.getByText('Portrait')).toBeTruthy();

    display.set(sizes(1024, 768));
    expect(await screen.findByText('1024 x 768')).toBeTruthy();
    expect(screen.getByText('Landscape')).toBeTruthy();
    expect(card('card-appearance').getByText('No')).toBeTruthy();
  });
});

describe('safe area card', () => {
  it('is unmeasured at first, then shows the insets and frame the provider reports', async () => {
    const { view } = await open();
    expect(card('card-safe-area').getByText('No')).toBeTruthy();
    const safeArea = view.componentRef.injector.get(SafeArea);
    safeArea.report({ top: 59, right: 0, bottom: 34, left: 0 }, { x: 0, y: 0, width: 393, height: 852 });

    expect(await screen.findByText('59')).toBeTruthy();
    expect(card('card-safe-area').getByText('34')).toBeTruthy();
    expect(card('card-safe-area').getByText('393 x 852')).toBeTruthy();
    expect(card('card-safe-area').getByText('Yes')).toBeTruthy();
  });
});

describe('network card', () => {
  it('shows the connection and updates when it drops', async () => {
    const { network } = await open();
    expect(await screen.findByText('Wi-Fi')).toBeTruthy();

    network.set({ connected: false, type: 'none', reachable: false });
    expect(await screen.findByText('None')).toBeTruthy();
    expect(card('card-network').getAllByText('No')).toHaveLength(2); // connected and reachable
  });

  it('shows reachable as still checking while the platform does not know', async () => {
    await open({ network: fakeNetwork({ connected: true, type: 'cellular', reachable: null }) });
    expect(await screen.findByText('Checking…')).toBeTruthy();
    expect(screen.getByText('Cellular')).toBeTruthy();
  });
});

describe('location card', () => {
  it('asks for the permission with a button, then offers tracking once granted', async () => {
    const location = fakeLocation();
    const { user } = await open({ location });
    expect(await screen.findByText('Not asked yet')).toBeTruthy();

    await user.press(screen.getByTestId('location-allow'));

    expect(await screen.findByText('Granted')).toBeTruthy();
    expect(location.native.requestForegroundPermissionsAsync).toHaveBeenCalledOnce();
    expect(screen.getByTestId('location-toggle')).toBeTruthy();
    expect(screen.queryByTestId('location-allow')).toBeNull();
  });

  it('stays on the button when the person says no, and starts nothing', async () => {
    const location = fakeLocation({ onRequest: permissions.denied });
    const { user } = await open({ location });
    await user.press(await screen.findByTestId('location-allow'));

    expect(await screen.findByText('Denied')).toBeTruthy();
    expect(screen.getByTestId('location-allow')).toBeTruthy();
    expect(screen.queryByTestId('location-toggle')).toBeNull();
    expect(location.native.watchPositionAsync).not.toHaveBeenCalled();
  });

  it('sends the person to Settings once the platform will not ask again', async () => {
    await open({ location: fakeLocation({ permission: permissions.blocked }) });

    expect(await screen.findByTestId('location-blocked')).toBeTruthy();
    expect(screen.queryByTestId('location-allow')).toBeNull();
  });

  it('shows the position as it arrives and the address of the latest fix', async () => {
    const location = fakeLocation({ permission: permissions.granted });
    const { user } = await open({ location });
    expect(await screen.findByTestId('location-empty')).toBeTruthy();

    await user.press(await screen.findByTestId('location-toggle'));
    await screen.findByText('Stop tracking');
    location.emit(40.41678, -3.70379);

    expect(await screen.findByText('40.41678')).toBeTruthy();
    expect(screen.getByText('-3.70379')).toBeTruthy();
    expect(screen.getByText('12 m')).toBeTruthy();
    expect(await screen.findByText(formatAddress(MADRID))).toBeTruthy();
    expect(location.native.reverseGeocodeAsync).toHaveBeenCalledOnce();
  });

  it('looks the address up again only after moving a meaningful distance', async () => {
    const location = fakeLocation({ permission: permissions.granted });
    const { user } = await open({ location });
    await user.press(await screen.findByTestId('location-toggle'));
    await screen.findByText('Stop tracking');

    location.emit(40.41678, -3.70379);
    await screen.findByText(formatAddress(MADRID));
    location.emit(40.41680, -3.70380, 2); // about 2 m away
    await screen.findByTestId('location-time');
    expect(location.native.reverseGeocodeAsync).toHaveBeenCalledTimes(1);

    location.emit(40.4268, -3.7038, 3); // over a kilometre away
    await screen.findByText('40.42680');
    expect(location.native.reverseGeocodeAsync).toHaveBeenCalledTimes(2);
  });

  it('says the address is not available when the geocoder fails', async () => {
    const location = fakeLocation({ permission: permissions.granted, geocode: new Error('throttled') });
    const { user } = await open({ location });
    await user.press(await screen.findByTestId('location-toggle'));
    await screen.findByText('Stop tracking');
    location.emit(40.41678, -3.70379);

    expect(await screen.findByText('Not available')).toBeTruthy();
  });

  it('says so when the watcher cannot start, and tries again on the next press', async () => {
    const location = fakeLocation({ permission: permissions.granted });
    location.native.watchPositionAsync.mockRejectedValueOnce(new Error('Location request failed due to unsatisfied device settings'));
    const { user } = await open({ location });
    await user.press(await screen.findByTestId('location-toggle'));

    expect(await screen.findByTestId('location-start-failed')).toBeTruthy();
    expect(screen.getByText('Start tracking')).toBeTruthy();

    await user.press(screen.getByTestId('location-toggle'));
    expect(await screen.findByText('Stop tracking')).toBeTruthy();
    expect(screen.queryByTestId('location-start-failed')).toBeNull();
  });

  it('stops tracking from the button and when the screen is destroyed', async () => {
    const location = fakeLocation({ permission: permissions.granted });
    const { user, view } = await open({ location });
    await user.press(await screen.findByTestId('location-toggle'));
    await user.press(await screen.findByText('Stop tracking'));
    expect(location.remove).toHaveBeenCalledOnce();
    expect(await screen.findByText('Start tracking')).toBeTruthy();

    await user.press(screen.getByTestId('location-toggle'));
    await screen.findByText('Stop tracking');
    expect(location.native.watchPositionAsync).toHaveBeenCalledTimes(2);

    view.componentRef.destroy();
    expect(location.remove).toHaveBeenCalledTimes(2);
  });
});

describe('geo helpers', () => {
  it('measures distance in metres', () => {
    expect(distanceMeters({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 })).toBe(0);
    expect(distanceMeters({ latitude: 40, longitude: -3 }, { latitude: 41, longitude: -3 })).toBeGreaterThan(110_000);
  });

  it('formats an address on one line and skips what is missing', () => {
    expect(formatAddress(MADRID)).toBe('Calle de Alcalá 1, Madrid, Madrid, Spain');
    expect(formatAddress({ ...MADRID, street: null, streetNumber: null, name: null, region: null })).toBe('Madrid, Spain');
  });
});
