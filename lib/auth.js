import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'change-this-dev-secret-please';
  if (!secret || secret.trim().length < 16) {
    throw new Error('JWT_SECRET manquant ou trop court. Configurez une valeur >= 16 caracteres.');
  }
  return secret;
}

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createToken(user) {
  const jwtSecret = getJwtSecret();
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      isPmr: user.isPmr,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  const jwtSecret = getJwtSecret();
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

/**
 * Extract user from request headers (Authorization: Bearer <token>)
 */
export function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

/**
 * Require authentication — returns user payload or throws Response
 */
export function requireAuth(request, requiredRoles = []) {
  const user = getUserFromRequest(request);
  if (!user) {
    return { error: 'Non authentifié', status: 401 };
  }
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return { error: 'Accès interdit', status: 403 };
  }
  return { user };
}
