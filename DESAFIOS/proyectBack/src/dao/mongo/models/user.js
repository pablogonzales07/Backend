import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    role:{
        type: String,
        default: "User"
    },
    password: String,
    cartId:{
        type: String,
        default: ""
    }
},{timestamps: true});

const userModel = mongoose.model(collection,schema);

export default userModel;