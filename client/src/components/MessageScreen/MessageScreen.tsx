import { Send } from "lucide-react";
import "./MessageScreen.css";
import { Socket } from "socket.io-client";
import { ChangeEvent, MouseEvent, useState } from "react";

interface MessageProps {
  user: string;
  showUserProfile: boolean;
  showUserProfileSetter: (value: boolean) => void;
  socket: Socket | null;
}

const MessageScreen = ({
  user,
  showUserProfile,
  showUserProfileSetter,
  socket,
}: MessageProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const messages = [
    { text: "Hello!", isSent: true },
    { text: "Hi there!", isSent: false },
    { text: "How are you?", isSent: true },
    { text: "I'm good, thanks!", isSent: false },
  ];

  const sendMessage = (e: MouseEvent<SVGElement>) => {
    e.preventDefault();
    (socket as Socket).emit("new-message", {
      message: currentMessage,
      sender: localStorage.getItem("currentUser"),
      receiver: user,
    });
    setCurrentMessage("");
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
        {messages.map((message: object, key: number) => {
          return (
            <div
              key={key}
              className={`p-5 pt-1 flex relative ${
                message?.isSent ? "justify-end" : "justtify-start"
              }`}
            >
              <p
                className={`${
                  !message?.isSent ? "bg-white" : "bg-slate-300"
                } p-5 max-w-[400px]`}
              >
                {message?.text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="footer rounded-lg flex justify-center items-center gap-2 p-5">
        <textarea
          name=""
          id=""
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setCurrentMessage(e.target.value)
          }
          className="rounded-lg flex items-center w-full h-[50px] min-h-[50px] max-h-[50px] pt-3 pl-3 pr-3 resize-none focus:outline-none"
          placeholder={"Search"}
        ></textarea>
        <Send
          className="h-7 w-7 cursor-pointer"
          onClick={(e: MouseEvent<SVGElement>) => sendMessage(e)}
        />
      </div>
    </div>
  );
};

export default MessageScreen;
