import axios from "axios";

const login = async (data: { username: string; password: string }) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/login",
      data,
      {
        withCredentials: true,
      }
    );
    const { data: responseData, status } = response;

    if (status === 201) {
      const { accessToken, refreshToken } = responseData;
      return {
        statusCode: "201",
        message: "Login Successful.",
        data,
        accessToken,
        refreshToken,
      };
    } else {
      return { statusCode: status, message: "Login Failed." };
    }
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: "500", message: "Internal Server Error" };
  }
};

export default login;
