import { Request, Response } from "express";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";

const getDirectChats = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    if (!username)
      res
        .status(404)
        .json({ statusCode: 404, message: "Username is required" });

    const user1 = await User.findById(req.user._id);

    if (!user1) {
      return res
        .status(401)
        .json({ statusCode: 404, message: "User does not exist." });
    }

    const user2 = await User.findOne({ username });

    if (!user2) {
      return res
        .status(404)
        .json({ statusCode: 404, message: `User ${username} doesn\'t exist.` });
    }

    if (user1?.username === username) {
      return res.status(400).json({
        statusCode: 400,
        message: `Username of sender and receiver cannot be same.`,
      });
    }

    const getChatsBetweenTheseTwoUsers = await Chat.findOne({
      $or: [
        { user1: user1?.username, user2: username },
        { user1: username, user2: user1?.username },
      ],
    });

    return  res.status(200).json({ statusCode: 200, message: "Chats fetched successfully.", data: getChatsBetweenTheseTwoUsers })

  } catch (error) {
    return res.status(500).send({ statusCode: 500, message: `${error || "Internal Server Error!"}` })
  }
};

export { getDirectChats };