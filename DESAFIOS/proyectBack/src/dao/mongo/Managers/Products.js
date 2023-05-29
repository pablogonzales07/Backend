import productsModel from "../models/product.js";

export default class ProductsManager {
    getProducts = (filterProducts, limitProducts=10, pageProducts=1,orderPrice) => {
        return productsModel.paginate(filterProducts,{limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true});
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