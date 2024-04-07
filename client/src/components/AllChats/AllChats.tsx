// AllChats.tsx

import { Search } from "lucide-react";
import "./AllChats.css";
import getLoggedInUser from "../../api/loggedInUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AllChatsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AllChats = ({ isOpen, setIsOpen }: AllChatsProps) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUserLoginDetails, setCurrentUserLoginDetails] = useState({
    username: "",
    name: "",
  });

  useEffect(() => {
    // Fetch the loggedInUser
    const loggedInUser = async () => {
      const response = await getLoggedInUser();
      if (response) {
        setCurrentUserLoginDetails({
          username: response?.username,
          name: response?.name,
        });
        setUsers(response?.contacts);


        const selectedUserFromStorage = localStorage.getItem("selectedUser");
        if (selectedUserFromStorage && isOpen) {
          navigate(`/chats/${selectedUserFromStorage}`);
        }
      } else {
        alert("Could not get user!");
      }
    };

    loggedInUser();
  }, []);

  const handleContactClick = (user: string) => {
    setIsOpen(true);
    setTimeout(() => {
      navigate(`/chats/${user}`);
      // Store the selected user in localStorage
      localStorage.setItem("selectedUser", user);
      localStorage.setItem("isOpen", "true");
    }, 0);
  };

  return (
    <div
      className={`rounded-[30px] h-full flex flex-col ${
        isOpen ? "w-1/4" : "w-full"
      }`}
    >
      {/* User Profile */}
      <div className="flex items-center gap-2">
        <div className="bg-black rounded-[50%] h-20 w-20"></div>
        <div className="flex flex-col">
          <p>{currentUserLoginDetails?.name}</p>
          <p>{currentUserLoginDetails?.username}</p>
        </div>
      </div>

      <div className="bg-[#eaeaea] mt-5 rounded-lg flex p-2 justify-center items-center gap-2">
        <textarea
          name=""
          id=""
          className="bg-[#eaeaea] rounded-lg flex items-center w-full h-10 min-h-10 max-h-10 pt-2 pl-3 resize-none focus:outline-none"
          placeholder={"Search"}
        ></textarea>
        <Search className="h-7 w-7 cursor-pointer" />
      </div>

      {/* Chats Section  */}
      <div className="pt-10">
        <p>Chats</p>

        {/* All Chats */}
        {users.map((user: string, key: number) => {
          return (
            <div
              key={key}
              className="flex mt-3 items-center gap-2 hover:bg-blue-300 hover:rounded-[20px] p-2"
              onClick={() => handleContactClick(user)}
            >
              <div className="bg-black rounded-[50%] h-10 w-10"></div>
              <div>{user}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllChats;
