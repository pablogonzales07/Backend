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
    discountCode: {
        type: Number,
        default: null
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Carts",
    },
    last_connection: {
        type: String,
        default: "Never logged in"
    },
    documents:{
        type: [
            {
                name:String, 
                reference: String 
            }
        ],
        default:[]
    }
},{timestamps: true});

const userModel = mongoose.model(collection,schema);

export default userModel;