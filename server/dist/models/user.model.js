import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // If you want usernames to be unique, keep this option
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // If you want emails to be unique, keep this option
    },
    phoneNo: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;
