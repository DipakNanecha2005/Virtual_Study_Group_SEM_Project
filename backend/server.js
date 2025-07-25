import "dotenv/config";
import { app } from "./app.js";
import { connectDB } from "./database/db.js";
import { setupSocket } from "./socket.js";
import { createServer } from 'node:http';

const port = process.env.PORT || 5001;

connectDB();

const server = createServer(app);
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

setupSocket(server);