import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getCompatibleDonorGroups } from '../utils/bloodCompatibility.js';
import { notifyContact } from '../services/notificationService.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { requesterId, requesterEmail, requesterPhone, bloodGroup, unitsRequired, city, state, country, area, hospitalName, hospitalAddress, urgency, requiredDate } = req.body;

  if (req.user?.id !== requesterId) return res.status(403).json(errorResponse('FORBIDDEN', 'You can only create requests for your own account.'));

  if (!requesterId || !bloodGroup || !city || !state || !country || !unitsRequired || !urgency) {
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Required request information is missing.'));
  }

  const requestId = `REQ-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const request: (typeof appState.requests)[number] = {
    id: `request-${Date.now()}`,
    requesterId,
    requestId,
    bloodGroup,
    unitsRequired: Number(unitsRequired),
    city,
    state,
    country,
    area: area || '',
    hospitalName: hospitalName || 'Not specified',
    hospitalAddress: hospitalAddress || 'Not specified',
    urgency,
    requiredDate: requiredDate || new Date().toISOString(),
    status: 'OPEN',
    createdAt: new Date().toISOString(),
  };

  appState.requests.push(request);

  const matchingDonors = appState.donors.filter((donor) => donor.availability !== 'UNAVAILABLE' && donor.city === city && getCompatibleDonorGroups(bloodGroup).includes(donor.bloodGroup as any));
  await Promise.all(matchingDonors.map(async (donor) => {
    const user = appState.users.find((entry) => entry.id === donor.userId);
    if (!user) return;
    await notifyContact({ userId: user.id, email: user.email, phone: user.phone, subject: `Urgent ${bloodGroup} blood request in ${city}`, message: `A ${urgency} request needs ${unitsRequired} unit(s) at ${hospitalName || 'a hospital'} in ${city}. Request ID: ${requestId}.` });
  }));

  if (requesterEmail || requesterPhone) await notifyContact({ userId: requesterId, email: requesterEmail, phone: requesterPhone, subject: `RAKTA request ${requestId} created`, message: `Your blood request for ${bloodGroup} in ${city} was created successfully. Request ID: ${requestId}.` });

  return res.status(201).json(
    successResponse(
      {
        ...request,
        matches: getCompatibleDonorGroups(bloodGroup),
      },
      'Blood request created successfully.',
    ),
  );
});

router.get('/', (_req, res) => {
  res.json(successResponse(appState.requests, 'Requests loaded.'));
});

router.get('/:id/matches', (req, res) => {
  const request = appState.requests.find((entry) => entry.id === req.params.id || entry.requestId === req.params.id);
  if (!request) {
    return res.status(404).json(errorResponse('REQUEST_NOT_FOUND', 'Blood request not found.'));
  }

  const compatibleGroups = getCompatibleDonorGroups(request.bloodGroup as any);
  const matches = appState.donors
    .filter((donor) => donor.city === request.city || donor.state === request.state)
    .filter((donor) => compatibleGroups.includes(donor.bloodGroup as any) || donor.bloodGroup === request.bloodGroup)
    .slice(0, 8)
    .map((donor) => ({ donorId: donor.id, name: donor.name, score: 85 + Math.round(Math.random() * 15), bloodGroup: donor.bloodGroup, city: donor.city }));

  res.json(successResponse({ requestId: request.requestId, matches }, 'Potential matches found.'));
});

router.post('/:id/help', requireAuth, (req: AuthenticatedRequest, res) => {
  const { donorId } = req.body;
  const request = appState.requests.find((entry) => entry.id === req.params.id || entry.requestId === req.params.id);

  if (!request) {
    return res.status(404).json(errorResponse('REQUEST_NOT_FOUND', 'Blood request not found.'));
  }

  if (!donorId) {
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'donorId is required.'));
  }

  const donor = appState.donors.find((entry) => entry.id === donorId);
  if (!donor || donor.userId !== req.user?.id) return res.status(403).json(errorResponse('FORBIDDEN', 'Only the matching donor can respond with help.'));

  const response: (typeof appState.helpResponses)[number] = {
    id: `help-${Date.now()}`,
    requestId: request.requestId,
    donorId,
    requesterId: request.requesterId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  appState.helpResponses.push(response);

  return res.status(201).json(successResponse(response, 'Help request sent.'));
});

export default router;
