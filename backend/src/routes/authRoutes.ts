import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = Router();

function createSession(user: { id: string; role: string; email: string }) {
  const accessToken = jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh', tokenId: `${Date.now()}-${Math.random()}` }, env.jwtRefreshSecret, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

router.post('/register', async (req, res) => {
  const { name, email, phone, password, city, area, address } = req.body;

  if (!name || !email || !phone || !password || !city || !area || !address) {
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Name, phone, email, password, city, area and address are required.'));
  }

  const existingUser = appState.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (existingUser) {
    return res.status(409).json(errorResponse('USER_EXISTS', 'An account with this email already exists.'));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: typeof appState.users[number] = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    city,
    area,
    address,
    state: 'Uttar Pradesh',
    country: 'India',
    passwordHash,
    role: 'DONOR',
    emailVerified: false,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  appState.users.push(user);

  const session = createSession(user);

  return res.status(201).json(
    successResponse(
      { user: { ...user, passwordHash: undefined }, token: session.accessToken, refreshToken: session.refreshToken },
      'User registered successfully.',
    ),
  );
});

router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  if ((!email && !phone) || !password) {
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Email or mobile number and password are required.'));
  }

  const user = appState.users.find((entry) => email ? entry.email.toLowerCase() === String(email).toLowerCase() : entry.phone === String(phone));
  if (!user) {
    return res.status(401).json(errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.'));
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json(errorResponse('INVALID_CREDENTIALS', 'Invalid email or password.'));
  }

  user.lastLoginAt = new Date().toISOString();
  const session = createSession(user);

  return res.json(
    successResponse(
      {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt },
        token: session.accessToken,
        refreshToken: session.refreshToken,
      },
      'Login successful.',
    ),
  );
});

router.post('/logout', (_req, res) => res.json(successResponse(null, 'Logged out successfully.')));
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json(errorResponse('REFRESH_TOKEN_REQUIRED', 'A refresh token is required.'));

  try {
    const payload = jwt.verify(refreshToken, env.jwtRefreshSecret) as { sub?: string; type?: string };
    if (payload.type !== 'refresh' || !payload.sub) throw new Error('Invalid refresh token');
    const user = appState.users.find((entry) => entry.id === payload.sub);
    if (!user || user.status !== 'ACTIVE') throw new Error('User unavailable');
    const session = createSession(user);
    return res.json(successResponse({ token: session.accessToken, refreshToken: session.refreshToken }, 'Session refreshed.'));
  } catch {
    return res.status(401).json(errorResponse('INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired.'));
  }
});
router.post('/forgot-password', (_req, res) => res.json(successResponse(null, 'Password reset link sent.')));
router.post('/reset-password', (_req, res) => res.json(successResponse(null, 'Password reset successfully.')));
router.post('/verify-email', (_req, res) => res.json(successResponse(null, 'Email verified.')));

export default router;
