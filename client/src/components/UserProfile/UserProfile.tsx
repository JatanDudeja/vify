import { Search } from "lucide-react";
import "./UserProfile.css";

interface UserProfileProps {
  showUserProfileSetter: (value: boolean) => void;
}

const UserProfile = ({ showUserProfileSetter }: UserProfileProps) => {
  return (
    <div className=" rounded-[30px] h-full p-5 flex flex-col w-1/4">
      {/* User Profile */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="bg-black rounded-[50%] h-[200px] w-[200px]"></div>
        <div className="flex flex-col justify-center items-center">
          <p>{"{Name}"}</p>
          <p>{"{Username}"}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center">
        <p>{"{Name}"}</p>
        <p>{"{Username}"}</p>
      </div>
    </div>
  );
};

export default UserProfile;
