import crypto from 'crypto';

// Use a secret key from environment variables, or a fallback secret
const SECRET = process.env.SESSION_SECRET || 'velocity_customer_session_secret_key_2026';

// 1. Password Hashing (using PBKDF2)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify entered password against saved hash
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  } catch {
    return false;
  }
}

// 2. Cookie Session Token Signing
export function signSession(sessionData: object): string {
  const dataStr = JSON.stringify(sessionData);
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(dataStr)
    .digest('hex');
  
  // Format token as base64Data.signature
  const base64Data = Buffer.from(dataStr).toString('base64');
  return `${base64Data}.${signature}`;
}

// Verify cookie session token signature and extract data
export function verifySession(token: string): any | null {
  if (!token) return null;
  try {
    const [base64Data, signature] = token.split('.');
    if (!base64Data || !signature) return null;

    // Verify signature
    const dataStr = Buffer.from(base64Data, 'base64').toString('utf8');
    const expectedSignature = crypto
      .createHmac('sha256', SECRET)
      .update(dataStr)
      .digest('hex');

    if (signature === expectedSignature) {
      return JSON.parse(dataStr);
    }
  } catch (error) {
    console.error('Session signature verification failed:', error);
  }
  return null;
}
