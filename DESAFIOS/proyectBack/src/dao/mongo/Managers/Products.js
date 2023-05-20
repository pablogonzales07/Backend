import productsModel from "../models/product.js";

export default class ProductsManager {
    getProducts = () => {
        return productsModel.find();
    }

    getProductBy = (param) => {
        return productsModel.findOne(param)
    }

    addProduct = (product) => {
        return productsModel.create(product);
    }

    updateProduct = (productId, company) => {
        return productsModel.findByIdAndUpdate(productId, { $set: company })        
    }

    deleteProduct = (productId) => {
        return productsModel.findByIdAndDelete(productId)
    }   
}