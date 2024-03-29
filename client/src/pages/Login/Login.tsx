import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";

const Login = () => {
    const { loginDetailsSetter } = useContext(AuthContext)

    const [userLoginDetails, setUserLoginDetails] = useState({
        username: "",
        password: ""
    })

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log(e.target.name, " : ", e.target.value)
        const { name, value } = e.target;
        setUserLoginDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const submitLogin = () => {
        if(userLoginDetails.username === ""){
            alert("Username cannot be empty")
        }
        if (userLoginDetails.password === ""){
            alert( "Password cannot be empty" )
        }
        loginDetailsSetter(userLoginDetails)
    }

  return (
    <div>
      <div className="flex flex-col">
        <p>Username</p>
        <input type="text" placeholder="Username/Email" value={userLoginDetails.username} onChange={handleInputChange} name='username' />
      </div>
      <div className="flex flex-col">
        <p>Password</p>
        <input type="text" placeholder="Password" value={userLoginDetails.password} onChange={handleInputChange} name="password"/>
      </div>
      <button onClick={submitLogin}>Submit</button>
    </div>
  );
};

export default Login;
