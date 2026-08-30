import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse } from '../utils/apiResponse.js';
import { errorResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.post('/login', (req, res) => {
  if (req.body.password !== env.adminPassword) return res.status(401).json(errorResponse('INVALID_ADMIN_PASSWORD', 'Invalid admin password.'));
  const token = jwt.sign({ role: 'ADMIN' }, env.jwtSecret, { expiresIn: '8h' });
  return res.json(successResponse({ token }, 'Admin login successful.'));
});

router.use(requireAdmin);

router.get('/stats', (_req, res) => {
  res.json(
    successResponse({
      totalUsers: appState.users.length,
      totalDonors: appState.donors.length,
      verifiedDonors: appState.donors.filter((donor) => donor.verificationStatus === 'VERIFIED').length,
      activeRequests: appState.requests.filter((request) => request.status === 'OPEN').length,
      criticalRequests: appState.requests.filter((request) => request.urgency === 'CRITICAL').length,
      completedRequests: appState.requests.filter((request) => request.status === 'COMPLETED').length,
      citiesCovered: new Set(appState.donors.map((donor) => donor.city)).size,
      donationsRecorded: appState.donors.reduce((total, donor) => total + donor.donationCount, 0),
    }),
  );
});

router.get('/users', (_req, res) => {
  res.json(successResponse(appState.users.map((user) => ({ id: user.id, name: user.name, role: user.role, email: user.email, status: user.status }))));
});

router.get('/donors', (_req, res) => {
  res.json(successResponse(appState.donors));
});

router.get('/requests', (_req, res) => {
  res.json(successResponse(appState.requests));
});

router.get('/activities', (_req, res) => {
  res.json(successResponse(appState.activities));
});

router.get('/help-responses', (_req, res) => {
  res.json(successResponse(appState.helpResponses));
});

router.patch('/requests/:id', (req, res) => {
  const request = appState.requests.find((entry) => entry.id === req.params.id || entry.requestId === req.params.id);
  if (!request) return res.status(404).json(errorResponse('REQUEST_NOT_FOUND', 'Blood request not found.'));
  if (!['OPEN', 'MATCHED', 'COMPLETED', 'CANCELLED'].includes(req.body.status)) return res.status(400).json(errorResponse('INVALID_STATUS', 'Invalid request status.'));
  request.status = req.body.status;
  return res.json(successResponse(request, 'Request status updated.'));
});

router.patch('/donors/:id', (req, res) => {
  const donor = appState.donors.find((entry) => entry.id === req.params.id);
  if (!donor) return res.status(404).json(errorResponse('DONOR_NOT_FOUND', 'Donor not found.'));
  if (req.body.verificationStatus) donor.verificationStatus = req.body.verificationStatus;
  if (req.body.availability) donor.availability = req.body.availability;
  return res.json(successResponse(donor, 'Donor record updated.'));
});

router.patch('/users/:id', (req, res) => {
  const user = appState.users.find((entry) => entry.id === req.params.id);
  if (!user) return res.status(404).json(errorResponse('USER_NOT_FOUND', 'User not found.'));
  if (!['ACTIVE', 'SUSPENDED'].includes(req.body.status)) return res.status(400).json(errorResponse('INVALID_STATUS', 'Invalid user status.'));
  user.status = req.body.status;
  return res.json(successResponse({ id: user.id, name: user.name, status: user.status }, 'User status updated.'));
});

export default router;
