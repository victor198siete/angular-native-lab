/**
 * Fake JWTs for the mock server: base64url(header).base64url(payload).signature. There is no
 * crypto and no secret - the signature is a literal, and the server only checks it is there. A real
 * server signs the token and the app never reads it for anything it trusts.
 */
export const MOCK_SIGNATURE = 'mock-signature';

export interface TokenClaims {
  readonly sub: string;
  readonly email: string;
  /** Issued at and expiry, in seconds since the epoch, as JWT defines them. */
  readonly iat: number;
  readonly exp: number;
  /** Which of the two this is, so a refresh token cannot be used as an access token. */
  readonly typ: 'access' | 'refresh';
  /** Unique per token: how the server tells a rotated refresh token from its replacement. */
  readonly jti: string;
}

const toBase64Url = (text: string) =>
  btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

const fromBase64Url = (text: string) => {
  const base64 = text.replace(/-/g, '+').replace(/_/g, '/');
  return atob(base64 + '='.repeat((4 - (base64.length % 4)) % 4));
};

export function encodeToken(claims: TokenClaims): string {
  const header = toBase64Url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  return `${header}.${toBase64Url(JSON.stringify(claims))}.${MOCK_SIGNATURE}`;
}

/** The claims inside a token, or `null` if it is not one of ours. */
export function decodeToken(token: string | null | undefined): TokenClaims | null {
  const parts = token?.split('.');
  if (parts?.length !== 3 || parts[2] !== MOCK_SIGNATURE) return null;
  try {
    const claims = JSON.parse(fromBase64Url(parts[1])) as Partial<TokenClaims>;
    return typeof claims.sub === 'string' && typeof claims.exp === 'number' && typeof claims.jti === 'string'
      ? (claims as TokenClaims)
      : null;
  } catch {
    return null;
  }
}
