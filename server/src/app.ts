import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import User from "./models/user.model.js";
import Chat from "./models/chat.model.js";
import chatRoutes from "./routes/chat.route.js";

interface MessageObject {
  sender: string;
  receiver: string;
  content: string;
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

app.use("/api/v1/chats", chatRoutes);

const userSocketMap = new Map<string, string>();

io.on("connection", (socket) => {
  socket.on("userConnect", (userID: string) => {
    userSocketMap.set(userID, socket.id);
    console.log("Connected: ", userID, " : ", socket.id);
  });

  socket.on("new-message", async (directMessage: MessageObject) => {
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

      // console.log("chats : ", addChat)
  
      const addSenderInReceiversContact = await User.findOne({
        username: directMessage?.receiver,
      });
  
      if (addSenderInReceiversContact) {
        const senderExists = addSenderInReceiversContact.contacts.includes(
          directMessage?.sender
        );
  
        if (!senderExists) {
          addSenderInReceiversContact.contacts.push(directMessage?.sender);
          await addSenderInReceiversContact.save();
        }
      }
      // console.log("1");
  
      if (addChat) {
        // If the chat already exists then just push the new message to it.
        const newMessage = {
          sender: directMessage?.sender,
          content: directMessage?.content,
          timestamp: new Date(),
        };
  
        // Check if 'content' is provided before pushing the message
        if (newMessage.content) {
          addChat.messages.push(newMessage);
          await addChat.save();
  
          // console.log(">>>", addChat.messages[addChat.messages.length - 1]);
  
          io.to(userSocketMap.get(directMessage?.receiver) as string).emit(
            "new-message",
            addChat.messages[addChat.messages.length - 1]
          );
        }
      } else {
        // Create a new chat and save it in the database.
        const newChat = await Chat.create({
          user1: directMessage?.sender,
          user2: directMessage?.receiver,
          messages: [
            {
              sender: directMessage?.sender,
              content: directMessage?.content,
              timestamp: new Date(),
            },
          ],
        });
  
        const addSenderInReceiversContact = await User.findOne({
          username: directMessage?.receiver,
        });
  
        if (addSenderInReceiversContact) {
          const senderExists = addSenderInReceiversContact.contacts.includes(
            directMessage?.sender
          );
          if (!senderExists) {
            addSenderInReceiversContact.contacts.push(directMessage?.sender);
            await addSenderInReceiversContact.save();
          }
        }
  
        try {
          await newChat.save();
          await addSenderInReceiversContact?.save();
        } catch (err) {
          console.log(`Error occurred while creating a new chat: ${err}`);
        }
        // console.log(newChat.messages[newChat.messages.length - 1]);
        io.to(userSocketMap.get(directMessage?.receiver) as string).emit(
          "new-message",
          newChat.messages[newChat.messages.length - 1]
        );
      }
    }
  });
  
  

  socket.on("disconnect", () => {
    userSocketMap.delete(socket?.id);
  });
});

export { app, server };
