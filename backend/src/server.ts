import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { successResponse } from './utils/apiResponse.js';
import { appState, seedAppState } from './store.js';

const app = express();

// Render, Railway, and similar hosts terminate TLS before forwarding requests.
// This keeps IP-based rate limiting accurate behind their reverse proxy.
if (env.isProduction) {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = env.allowedOrigins;
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', (req, res, next) => {
  let responseBody: any;
  const originalJson = res.json.bind(res);
  res.json = ((body: any) => {
    responseBody = body;
    return originalJson(body);
  }) as typeof res.json;

  res.on('finish', () => {
    const body = { ...(req.body || {}) };
    delete body.password;
    delete body.passwordHash;
    delete body.token;
    const actor = appState.users.find((user) => (body.email && user.email.toLowerCase() === String(body.email).toLowerCase()) || (body.phone && user.phone === String(body.phone)));
    appState.activities.unshift({
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action: `${req.method} ${req.path}`,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      actorId: body.userId || body.requesterId || actor?.id,
      details: { request: body, message: responseBody?.message || null },
      createdAt: new Date().toISOString(),
    });
    appState.activities = appState.activities.slice(0, 100);
  });
  next();
});
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.get('/api/health', (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === mongoose.ConnectionStates.connected;
  const healthy = !env.isProduction || databaseConnected;
  res.status(healthy ? 200 : 503).json(
    successResponse(
      { ok: healthy, service: 'RAKTA API', database: databaseConnected ? 'connected' : 'disconnected' },
      healthy ? 'API is healthy' : 'API database is unavailable',
    ),
  );
});

app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/account', accountRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await seedAppState();

  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    if (env.isProduction) {
      console.error('MongoDB connection failed. Refusing to start in production.', error);
      process.exit(1);
    }

    console.warn('MongoDB unavailable, continuing with in-memory app state for local development.', error);
  }

  const startOnPort = (port: number) => {
    const server = app.listen(port, () => {
      console.log(`RAKTA backend running on http://localhost:${port}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Set PORT to another value or stop the existing process.`);
        process.exit(1);
      }

      throw error;
    });
  };

  startOnPort(env.port);
}

startServer();
