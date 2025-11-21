import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { verificationRouter } from './routes/verification.js';
import { postsRouter } from './routes/posts.js';
import { communitiesRouter } from './routes/communities.js';
import { feedRouter } from './routes/feed.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan(config.environment === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'authentinet-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/verification', verificationRouter);
app.use('/api/posts', postsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/feed', feedRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Unexpected error',
  });
});
