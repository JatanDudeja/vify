import { useState } from "react";
import "./Layout.css"
import AllChats from "../AllChats/AllChats";
import MessageScreen from "../MessageScreen/MessageScreen";
import UserProfile from "../UserProfile/UserProfile";


function Layout() {

  const [selectedUser, setSelectedUser] = useState("");
  const [showUserProfile, setShowUserProfile] = useState(false);

  const selectedUserSetter = (user: string) => {
    setSelectedUser(user);
  };

  const showUserProfileSetter = (value: boolean) => {
    setShowUserProfile(value);
  };

  return (
   <div className="bg-white h-screen layoutContainer rounded-[20px] p-5 flex items-center justify-between gap-2">
      <AllChats selectedUser={selectedUser} selectedUserSetter={selectedUserSetter} />
      {selectedUser && <MessageScreen user={selectedUser} showUserProfile={showUserProfile} showUserProfileSetter={showUserProfileSetter} />}
      {showUserProfile && <UserProfile showUserProfileSetter={showUserProfileSetter} />}
    </div>
  );
}

export default Layout;
