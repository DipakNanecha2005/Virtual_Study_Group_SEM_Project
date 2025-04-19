import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGODB_URL);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected:", conn.connection.host);
    } catch (error) {
        console.error("Error while connecting database:", error);
        process.exit(1);
    }
}