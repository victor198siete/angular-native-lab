import type { Movement, MovementType } from '../models/index.ts';

/** Fixed "today" for the demo so the history never depends on the device clock. */
const REFERENCE_DATE = Date.UTC(2026, 8, 30, 15, 0, 0);
const DAY_MS = 86_400_000;

type Row = readonly [daysAgo: number, hourOffset: number, type: MovementType, points: number, description: string];

const ROWS: readonly Row[] = [
  [0, -3, 'earn', 420, 'Compra en supermercado'],
  [1, -5, 'earn', 180, 'Cena en restaurante'],
  [2, -1, 'redeem', 1500, 'Canje: Masaje relajante - Sesión individual'],
  [4, -6, 'earn', 950, 'Pago de tarjeta de crédito'],
  [5, -2, 'earn', 260, 'Compra en tienda departamental'],
  [7, -4, 'earn', 1200, 'Bono por referir un amigo'],
  [9, -7, 'earn', 340, 'Gasolina'],
  [11, -1, 'redeem', 600, 'Canje: Bono de restaurante - Para 2'],
  [12, -3, 'earn', 520, 'Pedido a domicilio'],
  [14, -5, 'earn', 75, 'Suscripción de streaming'],
  [16, -2, 'earn', 2100, 'Vuelo Bogotá - Cartagena'],
  [18, -6, 'earn', 310, 'Supermercado'],
  [20, -4, 'redeem', 2600, 'Canje: Renta de auto - Fin de semana'],
  [22, -1, 'earn', 640, 'Pago de tarjeta de crédito'],
  [24, -3, 'earn', 150, 'Café'],
  [26, -7, 'earn', 800, 'Bono de cumpleaños'],
  [28, -2, 'earn', 470, 'Compra de electrodomésticos'],
  [30, -5, 'redeem', 900, 'Canje: Cata de café de origen - Para 2'],
  [33, -4, 'earn', 1350, 'Hotel en Medellín'],
  [35, -1, 'earn', 220, 'Farmacia'],
  [37, -6, 'earn', 590, 'Pago de tarjeta de crédito'],
  [39, -3, 'earn', 130, 'Transporte por app'],
  [41, -2, 'redeem', 500, 'Canje: Entradas al cine - Entrada general'],
  [43, -5, 'earn', 880, 'Compra de tecnología'],
  [46, -4, 'earn', 260, 'Cine'],
  [48, -1, 'earn', 1000, 'Campaña de bienvenida Plata'],
  [50, -6, 'earn', 410, 'Compra de ropa'],
  [53, -3, 'earn', 190, 'Restaurante'],
  [56, -2, 'earn', 730, 'Pago de tarjeta de crédito'],
  [59, -5, 'earn', 350, 'Supermercado'],
];

export const MOCK_MOVEMENTS: readonly Movement[] = ROWS.map(
  ([daysAgo, hourOffset, type, points, description], index) => ({
    id: `mv-${String(ROWS.length - index).padStart(3, '0')}`,
    type,
    points,
    description,
    date: new Date(REFERENCE_DATE - daysAgo * DAY_MS + hourOffset * 3_600_000).toISOString(),
  }),
);
