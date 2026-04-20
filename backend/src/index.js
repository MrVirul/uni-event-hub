import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import { connectDB } from './lib/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Backend PORT running on port ${PORT}`);
  connectDB();
});
