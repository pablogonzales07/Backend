import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type:mongoose.SchemaTypes.ObjectId,
                    ref:'Products'
                },
                quantity: Number
            }
        ],
        default: []
    }
})


const cartsModel = mongoose.model(collection, schema);

export default cartsModel;