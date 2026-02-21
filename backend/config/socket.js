let ioInstance;

export const initializeSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.info(`🔌 Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.info(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

export const getSocket = () => {
  if (!ioInstance) {
    throw new Error('Socket.io is not initialized');
  }
  return ioInstance;
};
