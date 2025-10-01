import mongoose from "mongoose"
export const connectdb = async () => {


    try {
        const connect = await mongoose.connect('mongodb+srv://pateldheeraj8345:Dominetar3448%40@ufdr.dshoad0.mongodb.net/');
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
    }
    




}


