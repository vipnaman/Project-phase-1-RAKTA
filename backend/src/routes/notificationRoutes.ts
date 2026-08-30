import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(successResponse(appState.notifications, 'Notifications loaded.'));
});

router.patch('/:id/read', (req, res) => {
  const notification = appState.notifications.find((entry) => entry.id === req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found.' } });
  }

  notification.read = true;
  res.json(successResponse(notification, 'Notification marked as read.'));
});

router.patch('/read-all', (_req, res) => {
  appState.notifications.forEach((entry) => {
    entry.read = true;
  });
  res.json(successResponse(null, 'All notifications marked as read.'));
});

export default router;
