require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initSocket, getOnlineUsers } = require('./src/socket/socketHandler');


const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = initSocket(server);

// Make io and onlineUsers accessible to REST controllers via req.app.get()
app.set('io', io);
app.set('onlineUsers', getOnlineUsers());

console.log('[Server] Socket.IO attached to HTTP server');

// Start Server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g. database connection failures)
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

