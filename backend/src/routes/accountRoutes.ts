import { Router } from 'express';
import { appState } from '../store.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/:userId', (req, res) => {
  const user = appState.users.find((entry) => entry.id === req.params.userId);
  if (!user) return res.status(404).json(errorResponse('USER_NOT_FOUND', 'Account not found.'));

  const donor = appState.donors.find((entry) => entry.userId === user.id);
  const requests = appState.requests.filter((entry) => entry.requesterId === user.id);
  const helpResponses = appState.helpResponses.filter((entry) => entry.donorId === donor?.id || entry.requesterId === user.id);
  const notifications = appState.notifications.filter((entry) => entry.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const activities = appState.activities.filter((entry) => entry.actorId === user.id).slice(0, 50);

  return res.json(successResponse({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, city: user.city, area: user.area, address: user.address, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt },
    donor: donor || null,
    requests,
    helpResponses,
    notifications,
    activities,
    certificateEligible: Boolean(donor && donor.donationCount >= 3),
  }, 'Account activity loaded.'));
});

export default router;
