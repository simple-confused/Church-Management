import mongoose from "mongoose";

let isConnected = 0;

export default async function dbConnect() {
  if (isConnected) {
    console.log("Old connection");
    return;
  }
  try {
    console.log("New connection");
    const dbResponse = await mongoose.connect(process.env.DB_URL!);
    isConnected = dbResponse.connections[0].readyState;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}
