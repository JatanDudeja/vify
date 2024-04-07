import { useEffect, useState } from "react";
import "./Layout.css";
import AllChats from "../AllChats/AllChats";
import MessageScreen from "../MessageScreen/MessageScreen";
import UserProfile from "../UserProfile/UserProfile";
import { Socket, io } from "socket.io-client";

function Layout() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedUser, setSelectedUser] = useState(
    localStorage.getItem("selectedUser") || ""
  );
  const [isOpen, setIsOpen] = useState(
    Boolean(localStorage.getItem("isOpen")) || false
  );
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);
    socketInstance.emit("connection", () => {
      console.log("User connected.");
    });

    socketInstance.emit("userConnect", localStorage.getItem("currentUser"));


    return () => {
      if (socketInstance) {
        socketInstance.emit("disconnect", () => {
          console.log("Disconnected from the server.");
        });
        socketInstance.disconnect();
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const selectedUserSetter = (user: string) => {
    setSelectedUser(user);
  };

  const showUserProfileSetter = (value: boolean) => {
    setShowUserProfile(value);
  };

  return (
    <div className="bg-white h-screen layoutContainer rounded-[20px] p-5 flex items-center justify-between gap-2">
      <AllChats isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && (
        <MessageScreen
          user={selectedUser}
          showUserProfile={showUserProfile}
          showUserProfileSetter={showUserProfileSetter}
          socket={socket}
        />
      )}
      {showUserProfile && (
        <UserProfile showUserProfileSetter={showUserProfileSetter} />
      )}
    </div>
  );
}

export default Layout;
