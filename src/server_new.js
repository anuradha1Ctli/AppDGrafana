import express from 'express';
import dotenv from 'dotenv';
import { searchApplications } from './controllers/applicationController.js';
import { searchServices } from './controllers/serviceController.js';
import { fetchMetricsByServiceName } from './controllers/metricsController.js';
import { requireAuth } from './middleware/authMiddleware.js';
import { searchNamespaces } from './controllers/namespaceController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  next();
});

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.static("public"));

// API Routes
const router = express.Router();

router.post('/applications/search', requireAuth, searchApplications);
router.post('/services/search', requireAuth, searchServices);
router.post('/metrics/byservicename', requireAuth, fetchMetricsByServiceName);
router.post('/namespaces/search', requireAuth, searchNamespaces);

// Mount all API routes under /api
app.use('/api', router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler - must be last
app.use((req, res) => {
  console.log('404 Not Found:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server listening at this http://localhost:${port}`);
  console.log('Available routes:', [
    'POST /api/applications/search',
    'POST /api/services/search',
    'POST /api/metrics/byservicename',
    'POST /api/namespaces/search'
  ]);
});
