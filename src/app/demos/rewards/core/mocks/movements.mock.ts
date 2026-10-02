import type { Movement, MovementType } from '../models/index.ts';
import type { MockLanguage, Translated } from './language.ts';

/** Fixed "today" for the demo so the history never depends on the device clock. */
const REFERENCE_DATE = Date.UTC(2026, 8, 30, 15, 0, 0);
const DAY_MS = 86_400_000;

/** A redeem's description is the reward's title; the row says it was a redemption. */
type Row = readonly [daysAgo: number, hourOffset: number, type: MovementType, points: number, description: Translated];

const ROWS: readonly Row[] = [
  [0, -3, 'earn', 420, { en: 'Grocery store purchase', es: 'Compra en supermercado' }],
  [1, -5, 'earn', 180, { en: 'Dinner at a restaurant', es: 'Cena en restaurante' }],
  [2, -1, 'redeem', 1500, { en: 'Relaxing massage - Single session', es: 'Masaje relajante - Sesión individual' }],
  [4, -6, 'earn', 950, { en: 'Credit card payment', es: 'Pago de tarjeta de crédito' }],
  [5, -2, 'earn', 260, { en: 'Department store purchase', es: 'Compra en tienda departamental' }],
  [7, -4, 'earn', 1200, { en: 'Referral bonus', es: 'Bono por referir un amigo' }],
  [9, -7, 'earn', 340, { en: 'Fuel', es: 'Gasolina' }],
  [11, -1, 'redeem', 600, { en: 'Restaurant voucher - For 2', es: 'Bono de restaurante - Para 2' }],
  [12, -3, 'earn', 520, { en: 'Delivery order', es: 'Pedido a domicilio' }],
  [14, -5, 'earn', 75, { en: 'Streaming subscription', es: 'Suscripción de streaming' }],
  [16, -2, 'earn', 2100, { en: 'Flight Bogotá - Cartagena', es: 'Vuelo Bogotá - Cartagena' }],
  [18, -6, 'earn', 310, { en: 'Groceries', es: 'Supermercado' }],
  [20, -4, 'redeem', 2600, { en: 'Car rental - Weekend', es: 'Renta de auto - Fin de semana' }],
  [22, -1, 'earn', 640, { en: 'Credit card payment', es: 'Pago de tarjeta de crédito' }],
  [24, -3, 'earn', 150, { en: 'Coffee', es: 'Café' }],
  [26, -7, 'earn', 800, { en: 'Birthday bonus', es: 'Bono de cumpleaños' }],
  [28, -2, 'earn', 470, { en: 'Appliance purchase', es: 'Compra de electrodomésticos' }],
  [30, -5, 'redeem', 900, { en: 'Single-origin coffee tasting - For 2', es: 'Cata de café de origen - Para 2' }],
  [33, -4, 'earn', 1350, { en: 'Hotel in Medellín', es: 'Hotel en Medellín' }],
  [35, -1, 'earn', 220, { en: 'Pharmacy', es: 'Farmacia' }],
  [37, -6, 'earn', 590, { en: 'Credit card payment', es: 'Pago de tarjeta de crédito' }],
  [39, -3, 'earn', 130, { en: 'Ride-hailing', es: 'Transporte por app' }],
  [41, -2, 'redeem', 500, { en: 'Movie tickets - General admission', es: 'Entradas al cine - Entrada general' }],
  [43, -5, 'earn', 880, { en: 'Electronics purchase', es: 'Compra de tecnología' }],
  [46, -4, 'earn', 260, { en: 'Cinema', es: 'Cine' }],
  [48, -1, 'earn', 1000, { en: 'Silver welcome campaign', es: 'Campaña de bienvenida Plata' }],
  [50, -6, 'earn', 410, { en: 'Clothing purchase', es: 'Compra de ropa' }],
  [53, -3, 'earn', 190, { en: 'Restaurant', es: 'Restaurante' }],
  [56, -2, 'earn', 730, { en: 'Credit card payment', es: 'Pago de tarjeta de crédito' }],
  [59, -5, 'earn', 350, { en: 'Groceries', es: 'Supermercado' }],
];

export function buildMovements(language: MockLanguage = 'en'): Movement[] {
  return ROWS.map(([daysAgo, hourOffset, type, points, description], index) => ({
    id: `mv-${String(ROWS.length - index).padStart(3, '0')}`,
    type,
    points,
    description: description[language],
    date: new Date(REFERENCE_DATE - daysAgo * DAY_MS + hourOffset * 3_600_000).toISOString(),
  }));
}
