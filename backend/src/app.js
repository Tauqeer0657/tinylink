import express from 'express';
import cors from 'cors';
import linkRoutes from './routes/linkRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import helmet from 'helmet';
import xssClean from 'xss-clean';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(xssClean());

app.get('/healthz', (req, res) => {
  res.status(200).json({
    ok: true,
    version: '1.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/', linkRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
