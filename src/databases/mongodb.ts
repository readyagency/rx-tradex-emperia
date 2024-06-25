import mongoose from "mongoose";

mongoose.connect("mongodb://mongodb:27017/rx-storage");
const mongodb = mongoose.connection;

export default mongodb;
