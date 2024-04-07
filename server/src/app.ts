import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import User from "./models/user.model.js";
import Chat from "./models/chat.model.js";

interface MessageObject {
  sender: string;
  receiver: string;
  message: string;
  isDelivered?: boolean;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRoutes);

const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  socket.on("userConnect", (userID: string) => {
    userSocketMap.set(userID, socket.id);
    console.log("Connected: ", userID, " : ", socket.id);
  });

  socket.on("new-message", async (directMessage: MessageObject) => {
    console.log(directMessage);
    if (userSocketMap?.has(directMessage?.receiver)) {
      const addChat = await Chat.findOne({
        $or: [
          {
            $and: [
              { user1: directMessage?.sender },
              { user2: directMessage?.receiver },
            ],
          },
          {
            $and: [
              { user1: directMessage?.receiver },
              { user2: directMessage?.sender },
            ],
          },
        ],
      });

      if (addChat) {
        // If the chat already exists then just push the new message to it.
        addChat.messages.push({
          sender: directMessage?.sender,
          content: directMessage?.message,
          timestamp: new Date(),
        });
        await addChat.save();

        io.to(userSocketMap.get(directMessage?.receiver) as string).emit(
          "new-message",
          directMessage?.message
        );
      } else {
        // Create a new chat and save it in the database.
        let newChat = await Chat.create({
          user1: directMessage?.sender,
          user2: directMessage?.receiver,
          messages: [{
            sender: directMessage?.sender,
            content: directMessage?.message,
            timestamp: new Date(),
          }],
        });

        try {
          await newChat.save();
        } catch (err) {
          console.log(`Error occured while creating a new chat ${err}`);
        }
      }
    }
    // io.to(userSocketMap.get(directMessage?.receiver) as string).emit(
    //   "new-message",
    //   directMessage?.message
    // );
  });

  socket.on("disconnect", () => {
    userSocketMap.delete(socket?.id);
  });
});

export { app, server };
