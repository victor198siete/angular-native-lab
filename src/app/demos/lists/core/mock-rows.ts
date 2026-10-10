import { type MockLanguage, type Translated } from '../../rewards/core/mocks/language.ts';

/** One mock row. Deterministic: the same index always gives the same row. */
export interface MockRow {
  readonly id: number;
  readonly name: string;
  readonly line: string;
}

export const SIZES = [200, 2000] as const;
export type ListSize = (typeof SIZES)[number];

const FIRST = ['Ada', 'Bruno', 'Carla', 'Diego', 'Elena', 'Félix', 'Gala', 'Hugo', 'Inés', 'Jorge', 'Lucía', 'Mateo'];
const LAST = ['Rivas', 'Soler', 'Vidal', 'Ortega', 'Prado', 'Luna', 'Cruz', 'Mora', 'Navarro', 'Ibarra'];
const LINES: readonly Translated[] = [
  { en: 'Checked in at the front desk', es: 'Hizo check-in en recepción' },
  { en: 'Booked the morning tour', es: 'Reservó el tour de la mañana' },
  { en: 'Asked about a late checkout', es: 'Preguntó por una salida tardía' },
  { en: 'Paid the deposit', es: 'Pagó el depósito' },
  { en: 'Joined the waiting list', es: 'Se unió a la lista de espera' },
];

export function buildRows(count: number, language: MockLanguage = 'en'): MockRow[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    name: `${FIRST[id % FIRST.length]} ${LAST[Math.floor(id / FIRST.length) % LAST.length]}`,
    line: LINES[(id * 7) % LINES.length][language],
  }));
}

/** Built once per language: the 200-row list is the first 200 of the 2,000, so switching size keeps row identity. */
const ALL_ROWS: Readonly<Record<MockLanguage, readonly MockRow[]>> = { en: buildRows(2000, 'en'), es: buildRows(2000, 'es') };
export const rowsFor = (size: ListSize, language: MockLanguage = 'en'): readonly MockRow[] => ALL_ROWS[language].slice(0, size);
