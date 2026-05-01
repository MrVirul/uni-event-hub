import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import { connectDB } from './lib/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration
const allowedOrigins = [
  "http://localhost:8081",
  "https://interunieventhub.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests for all routes
app.options("*", cors());

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
  res.send('Uni Event Hub API is running...');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Backend PORT running on port ${PORT}`);
  connectDB();
});
