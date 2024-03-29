import { Search } from "lucide-react";
import "./AllChats.css";
import { useEffect, useState } from "react";

interface AllChatsProps {
  selectedUser: string;
  selectedUserSetter : (user: string) => void;
}

const AllChats = ({ selectedUser, selectedUserSetter } : AllChatsProps) => {
  const [users, setUsers] = useState([""]);

  useEffect(() => {
    setUsers(["User 1", "User 2", "User 3", "User 4", "User 5"]);
  }, []);

  return (
    <div className={`rounded-[30px] h-full flex flex-col ${selectedUser ? "w-1/4" : "w-full"}`}>
      {/* User Profile */}
      <div className="flex items-center gap-2">
        <div className="bg-black rounded-[50%] h-20 w-20"></div>
        <div className="flex flex-col">
          <p>{"{Name}"}</p>
          <p>{"{Username}"}</p>
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
              onClick={() => selectedUserSetter(user)}
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
