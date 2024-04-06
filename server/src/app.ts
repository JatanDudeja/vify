import 'dotenv/config'
import express from 'express';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import userRoutes from './routes/user.route.js';
import cookieParser from 'cookie-parser';

interface MessageObject{
    to : string,
    myself: string,
    mess: string
}

const app = express();
const server = http.createServer(app);
const io  = new Server(server, { cors: { origin: '*' } });

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); 
app.use(cookieParser())

app.use("/api/v1/users", userRoutes);

io.on("connection", (socket) => {
    socket.on("new-message", ( message : MessageObject) => {
        console.log(message?.mess)
        io.to(message?.to).emit("new-message", message?.mess)
    })
})

export { app, server };