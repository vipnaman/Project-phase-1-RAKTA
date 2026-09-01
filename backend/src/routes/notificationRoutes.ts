import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req: AuthenticatedRequest, res) => {
  const notifications = appState.notifications.filter((entry) => entry.userId === req.user?.id);
  res.json(successResponse(notifications, 'Notifications loaded.'));
});

router.patch('/:id/read', (req: AuthenticatedRequest, res) => {
  const notification = appState.notifications.find((entry) => entry.id === req.params.id);
  if (!notification || notification.userId !== req.user?.id) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found.' } });
  }

  notification.read = true;
  res.json(successResponse(notification, 'Notification marked as read.'));
});

router.patch('/read-all', (req: AuthenticatedRequest, res) => {
  appState.notifications.forEach((entry) => {
    if (entry.userId === req.user?.id) entry.read = true;
  });
  res.json(successResponse(null, 'All notifications marked as read.'));
});

router.delete('/read', (req: AuthenticatedRequest, res) => {
  appState.notifications = appState.notifications.filter((entry) => entry.userId !== req.user?.id || !entry.read);
  res.json(successResponse(null, 'Read notifications deleted.'));
});

router.delete('/:id', (req: AuthenticatedRequest, res) => {
  const index = appState.notifications.findIndex((entry) => entry.id === req.params.id && entry.userId === req.user?.id);
  if (index === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found.' } });
  appState.notifications.splice(index, 1);
  res.json(successResponse(null, 'Notification deleted.'));
});

export default router;
