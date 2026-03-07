// import WebSocketServer from 'ws';

// const wss = new WebSocketServer.Server({ port: 8080 });
// wss.on('connection', (ws) => {
//   console.log('Client connected');
//     ws.on('message', (message:any) => {
//         console.log(`Received message: ${message}`);
//         // Broadcast the message to all connected clients
//         wss.clients.forEach((client) => {
//             if (client !== ws && client.readyState === WebSocketServer.OPEN) {
//                 client.send(message);
//             }
//         });
//     });
//     ws.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// console.log('WebSocket server is running on ws://localhost:8080');