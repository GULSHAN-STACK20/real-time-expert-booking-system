import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectDatabase } from './config/db.js';
import { initializeSocket } from './config/socket.js';
import bookingRoutes from './routes/bookingRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  })
);
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.get("/", (req, res) => {
  res.send("Real-Time Expert Booking API Running");
});

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
  },
});

initializeSocket(io);

const startServer = async () => {
  await connectDatabase(process.env.MONGO_URI);

  server.listen(port, () => {
    console.info(`🚀 Server running on port ${port}`);
  });
};

startServer();
