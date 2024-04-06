import axios from "axios";

const getLoggedInUser = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/getLoggedInUser",
      {},
      {
        withCredentials: true,
      }
    );
    const { data: responseData, status } = response;

    if (status === 200) {
      return responseData?.message
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: "500", message: "Internal Server Error" };
  }
};

export default getLoggedInUser;
