import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(successResponse(appState.donors, 'Donors fetched successfully.'));
});

router.post('/profile', (req, res) => {
  const { userId, name, bloodGroup, city, state, country, area, availability } = req.body;

  if (!userId || !name || !bloodGroup || !city || !state || !country || !availability) {
    return res.status(400).json(errorResponse('VALIDATION_ERROR', 'Complete donor profile details are required.'));
  }

  const donor: (typeof appState.donors)[number] = {
    id: `donor-${Date.now()}`,
    userId,
    name,
    bloodGroup,
    city,
    state,
    country,
    area: area || '',
    availability,
    verificationStatus: 'PENDING',
    donationCount: 0,
    lastDonationDate: new Date().toISOString(),
    lastActive: 'Just now',
    privacy: { showArea: true },
  };

  appState.donors.push(donor);
  return res.status(201).json(successResponse(donor, 'Donor profile created.'));
});

router.patch('/profile', (req, res) => {
  const { userId, ...rest } = req.body;
  const donorIndex = appState.donors.findIndex((entry) => entry.userId === userId || entry.id === userId);

  if (donorIndex === -1) {
    return res.status(404).json(errorResponse('DONOR_NOT_FOUND', 'Donor profile not found.'));
  }

  appState.donors[donorIndex] = { ...appState.donors[donorIndex], ...rest };
  return res.json(successResponse(appState.donors[donorIndex], 'Donor profile updated.'));
});

router.patch('/availability', (req, res) => {
  const { userId, availability } = req.body;
  const donor = appState.donors.find((entry) => entry.userId === userId || entry.id === userId);

  if (!donor) {
    return res.status(404).json(errorResponse('DONOR_NOT_FOUND', 'Donor not found.'));
  }

  donor.availability = availability || donor.availability;
  donor.lastActive = 'Just now';
  return res.json(successResponse(donor, 'Availability updated.'));
});

router.post('/:id/donations/complete', (req, res) => {
  const donor = appState.donors.find((entry) => entry.id === req.params.id || entry.userId === req.params.id);
  if (!donor) return res.status(404).json(errorResponse('DONOR_NOT_FOUND', 'Donor not found.'));
  donor.donationCount += 1;
  donor.lastDonationDate = new Date().toISOString();
  const eligible = donor.donationCount >= 3;
  return res.json(successResponse({ donor, eligible, certificateUrl: eligible ? `/api/donors/${donor.id}/certificate` : null }, 'Completed donation recorded.'));
});

router.get('/:id/certificate', (req, res) => {
  const donor = appState.donors.find((entry) => entry.id === req.params.id || entry.userId === req.params.id);
  if (!donor) return res.status(404).json(errorResponse('DONOR_NOT_FOUND', 'Donor not found.'));
  if (donor.donationCount < 3) return res.status(403).json(errorResponse('CERTIFICATE_NOT_ELIGIBLE', 'Three completed donations are required.'));
  return res.json(successResponse({ certificateId: `CERT-${donor.id}-${donor.donationCount}`, donorName: donor.name, donationCount: donor.donationCount, issuedAt: new Date().toISOString(), message: 'This certificate recognizes your life-saving contribution through RAKTA.' }, 'Certificate available.'));
});

export default router;
