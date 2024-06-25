import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/rx-storage");
const mongodb = mongoose.connection;

export default mongodb;
