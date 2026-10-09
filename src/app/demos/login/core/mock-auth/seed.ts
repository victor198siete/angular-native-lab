/**
 * The mock server's only account. Fictional: the `.test` TLD is reserved and never resolves.
 * This is the one place the test password lives; the screens, tests and docs read it from here
 * (the Maestro flow takes it from env vars that default to these values).
 */
export const SEED_USER = {
  id: 'usr_01',
  email: 'ada@lab.test',
  password: 'lab-password-1',
  name: 'Ada Lovelace',
  memberSince: '2026-01-15',
} as const;
