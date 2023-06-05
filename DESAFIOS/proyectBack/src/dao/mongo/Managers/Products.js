import productsModel from "../models/product.js";

export default class ProductsManager {
    getProducts = (filterCategory, filterDisponibility, anyFilter, limitProducts=10, pageProducts=1,orderPrice) => {
        if(filterCategory) return productsModel.paginate({category: filterCategory}, {limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true} )
        if(filterDisponibility) return productsModel.paginate({status: filterDisponibility}, {limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true} )   
        if(filterCategory && filterDisponibility) return productsModel.paginate({category: filterCategory, status: filterDisponibility}, {limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true} )
        if(anyFilter) return productsModel.paginate(anyFilter,{limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true});
        return productsModel.paginate({},{limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true});
    }

    getProductBy = (param) => {
        return productsModel.findOne(param)
    }

    addProduct = (product) => {
        return productsModel.create(product);
    }

    updateProduct = (productId, fieldsProduct) => {
        return productsModel.findByIdAndUpdate(productId, { $set: fieldsProduct })        
    }

    deleteProduct = (productId) => {
        return productsModel.findByIdAndDelete(productId)
    }   
}