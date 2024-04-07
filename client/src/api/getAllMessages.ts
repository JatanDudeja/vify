import axios from "axios"

const getAllMessages = async (username: string) => {
    const data = {
        username
    }
    const response = await axios.post("http://localhost:3000/api/v1/chats/getDirectChats", data, {
        withCredentials : true
    })

    if(response?.status === 200) return response?.data;

    else false;
}
export default getAllMessages;