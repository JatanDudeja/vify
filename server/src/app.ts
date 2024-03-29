import 'dotenv/config'
import express from 'express';
import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import User from './models/user.model.js';

interface MessageObject{
    to : string,
    myself: string,
    mess: string
}

const app = express();
const server = http.createServer(app);
const io  = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json()); 
app.get("/", (req, res) => {
    res.send("Hello Ji!")
})

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if(username.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Username cannot be empty" })
    }
    if(password.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Password cannot be empty" })
    }

    res.status(201).json({statusCode : "201", message: "Login Successful.", data: {username, password}});
})

app.post("/signup", (req, res) => {
    const { username, password, name, phoneNo, email } = req.body;

    if(username.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Username cannot be empty" })
    }
    if(password.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Password cannot be empty" })
    }
    if(name.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Name cannot be empty" })
    }
    if(phoneNo.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Phone number cannot be empty" })
    }
    if(email.trim() === ""){
        res.status(422).json({ statusCode : "422", error: "Email cannot be empty" })
    }

    const user = User.create({
        username,
        password,
        name,
        phoneNo,
        email
    })

    if(!user){
        res.status(503).json({ statusCode : "503", error: "Server Error." });
    }



    res.status(201).json({statusCode : "201", message: "Login Successful.", user});
})

io.on("connection", (socket) => {
    socket.on("new-message", ( message : MessageObject) => {
        console.log(message?.mess)
        io.to(message?.to).emit("new-message", message?.mess)
    })
})

export { app, server };