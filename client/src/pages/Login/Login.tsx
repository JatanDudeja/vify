import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import login from "../../api/login";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { loginDetailsSetter } = useContext(AuthContext);

  const [userLoginDetails, setUserLoginDetails] = useState({
    username: "",
    password: "",
    accessToken: "",
    refreshToken: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUserLoginDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const submitLogin = async () => {
    if (userLoginDetails.username === "") {
      alert("Username cannot be empty");
    }
    if (userLoginDetails.password === "") {
      alert("Password cannot be empty");
    }
    const response = await login(userLoginDetails);

    if (response) {
      loginDetailsSetter({...userLoginDetails, accessToken: response?.accessToken, refreshToken: response?.refreshToken});
      localStorage.setItem("accessToken", await response?.accessToken)
      localStorage.setItem("refreshToken", await response?.refreshToken)
      navigate("/chats");
    } else {
      alert("Could not login.");
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <p>Username</p>
        <input
          type="text"
          placeholder="Username/Email"
          value={userLoginDetails.username}
          onChange={handleInputChange}
          name="username"
        />
      </div>
      <div className="flex flex-col">
        <p>Password</p>
        <input
          type="text"
          placeholder="Password"
          value={userLoginDetails.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>
      <button onClick={submitLogin}>Submit</button>
    </div>
  );
};

export default Login;
