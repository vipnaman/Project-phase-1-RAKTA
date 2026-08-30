import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = Router();

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

  return res.status(201).json(
    successResponse(
      { user: { ...user, passwordHash: undefined }, token: 'local-demo-token' },
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

  return res.json(
    successResponse(
      {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, emailVerified: user.emailVerified, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt },
        token: 'local-demo-token',
      },
      'Login successful.',
    ),
  );
});

router.post('/logout', (_req, res) => res.json(successResponse(null, 'Logged out successfully.')));
router.post('/refresh', (_req, res) => res.json(successResponse({ token: 'local-demo-token' }, 'Token refreshed.')));
router.post('/forgot-password', (_req, res) => res.json(successResponse(null, 'Password reset link sent.')));
router.post('/reset-password', (_req, res) => res.json(successResponse(null, 'Password reset successfully.')));
router.post('/verify-email', (_req, res) => res.json(successResponse(null, 'Email verified.')));

export default router;
