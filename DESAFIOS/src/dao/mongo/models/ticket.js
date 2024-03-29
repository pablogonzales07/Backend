import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema(
    {
        code: String,
        purchase_date: { 
            type: Date, 
            default: Date.now 
        },
        amount: Number,
        purchaser: String
    }
)

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;