import { Server } from "http"
import app from "./app";
import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
let server: Server;

async function main() {
    try {
        const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8ggzn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

        await mongoose.connect(uri);
        console.log("Connected to MongoDB using Mongoose!!")

        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`)
        })
    } catch (error) {
        console.error('Faild to start the server', (error as Error).message);
        process.exit(1)
    }
}
main()  