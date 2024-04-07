import { Send } from "lucide-react";
import "./MessageScreen.css";
import { Socket } from "socket.io-client";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import getAllMessages from "../../api/getAllMessages";
import { ObjectId } from "mongodb";

interface MessageProps {
  user: string;
  showUserProfile: boolean;
  showUserProfileSetter: (value: boolean) => void;
  socket: Socket | null;
}

interface ReceivedMessagesType {
  sender: string;
  content: string;
  timestamp?: Date;
  _id?: ObjectId;
}

const MessageScreen = ({
  user,
  showUserProfile,
  showUserProfileSetter,
  socket,
}: MessageProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<ReceivedMessagesType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getAllDirectMessages = async () => {
      try {
        const response = await getAllMessages(user);

        if (response) {
          console.log(response?.data?.messages);
          setMessages(response?.data?.messages);
        }

        console.log("Messages : ", messages);
        scrollToBottom(); // Scroll to bottom after loading messages
      } catch (error) {
        console.log("Could not load messages.");
      }
    };

    getAllDirectMessages();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new-message", (message: ReceivedMessagesType) => {
        console.log("Received message:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottomOnPageLoad(); // Scroll to bottom when page is loaded or refreshed
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToBottomOnPageLoad = () => {
    setTimeout(() => {
      scrollToBottom();
    }, 100); // Adding a small timeout to ensure scrolling after the component is rendered
  };

  const sendMessage = (e: MouseEvent<SVGElement>) => {
    e.preventDefault();
    const newMessage = {
      content: currentMessage,
      sender: localStorage.getItem("currentUser") || "",
      receiver: user
    };
  
    // Emit the new message to the server
    (socket as Socket).emit("new-message", newMessage);
  
    // Add the new message to the state
    setMessages(prevMessages => [...prevMessages, newMessage]);
  
    // Clear the current message input
    setCurrentMessage("");
  
    // Scroll to the bottom to show the latest message
    scrollToBottom();
  };
  

  const renderMessagesArray = () => {
    return messages.map((message: ReceivedMessagesType, key: number) => {
      return (
        <div
          key={key}
          className={`p-5 pt-1 flex relative ${
            message?.sender === localStorage.getItem("currentUser")
              ? "justify-end"
              : "justtify-start"
          }`}
        >
          <p
            className={`${
              message?.sender !== localStorage.getItem("currentUser")
                ? "bg-white"
                : "bg-slate-300"
            } p-5 max-w-[400px]`}
          >
            {message?.content}
          </p>
        </div>
      );
    });
  };

  return (
    <div
      className={`bg-slate-200 rounded-[30px] h-full flex flex-col ${
        showUserProfile ? "w-2/4" : "w-3/4"
      }`}
    >
      <div className="bg-slate-400 w-full rounded-t-[30px] p-5 hover:cursor-pointer">
        <p onClick={() => showUserProfileSetter(!showUserProfile)}>{user}</p>
      </div>

      <div className="messagesContainer overflow-y-auto flex-1">
        {renderMessagesArray()}
        <div ref={messagesEndRef} />
      </div>

      <div className="footer rounded-lg flex justify-center items-center gap-2 p-5">
        <input
          name="message"
          value={currentMessage}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setCurrentMessage(e.target.value)
          }
          className="rounded-lg flex items-center w-full h-[50px] min-h-[50px] max-h-[50px] pl-3 pr-3 resize-none focus:outline-none"
          placeholder={"Type your message here..."}
        ></input>
        <div className="hover:bg-slate-400 h-12 w-12 flex justify-center items-center rounded-lg">
          <Send
            className="h-7 w-7 cursor-pointer"
            onClick={(e: MouseEvent<SVGElement>) => sendMessage(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageScreen;
