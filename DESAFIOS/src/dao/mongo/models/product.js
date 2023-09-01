import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "Products";

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    code: String,
    price: Number,
    status: {
      type: Boolean,
      default: true,
    },
    stock: Number,
    sizes:{
      type: Array,
      default: []
    },
    category: String,
    img: String,
    thumbnails: [],
    owner: {
      type: String,
      default: "Admin"
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

schema.plugin(mongoosePaginate);

const productsModel = mongoose.model(collection, schema);

export default productsModel;
