import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'parking-esiee-secret-dev';

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      isPmr: user.isPmr,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
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
