import { ReactNode, createContext, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loginDetailsSetter: (details: { username: string; password: string, accessToken: string,  refreshToken: string }) => void;
  loginDetails: { username?: string; password?: string, accessToken?: string, refreshToken? : string };
};

// Create the context with the defined type
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  loginDetailsSetter: () => {},
  loginDetails: { username: "", password: "", accessToken: localStorage.getItem("accessToken") || "", refreshToken : localStorage.getItem("refreshToken") || "" }
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginDetails, setLoginDetails] = useState<{ username?: string; password?: string, accessToken?: string, refreshToken?: string }>({
    username: "",
    password: "",
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || ""
  });

  const loginDetailsSetter = (details: { username: string; password: string, accessToken?: string, refreshToken?: string }) => {
    setLoginDetails(details);
    if(details?.username.trim() === ""){
      alert("Username cannot be empty.");
    }
    if(details?.password.trim() === ""){
      alert("Password cannot be empty.");
    }
    // localStorage.setItem("isLoggedIn", isLoggedIn);
  };

  const login = () => {
    // Your login logic here
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Your logout logic here
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loginDetailsSetter, loginDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
