import mongoose from "mongoose";

const connectDB = async() => {
    const dbConnect = mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}

export default connectDB;