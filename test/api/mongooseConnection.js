import mongoose from "mongoose";

let isConnected;

export default async function connectToDatabase(){
  if (isConnected) {
    return;
  }

  const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-monitoring-test';
  await mongoose.connect(dbUri);

  isConnected = mongoose.connection.readyState;
};
