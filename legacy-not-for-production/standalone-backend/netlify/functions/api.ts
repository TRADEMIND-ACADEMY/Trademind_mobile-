import serverless from 'serverless-http';
import { app } from '../../server.js';

// Netlify Serverless Handler wrapping the unified TradeMind Express backend
export const handler = serverless(app, {
  binary: ['image/*', 'application/octet-stream', 'application/zip']
});
