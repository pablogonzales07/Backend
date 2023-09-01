import productsModel from "../models/product.js";

export default class ProductsManager {

    //Method to get all products
    get = (filterCategory, filterDisponibility, anyFilter, limitProducts=40, pageProducts=1,orderPrice) => {
        if(filterCategory) return productsModel.paginate({category: filterCategory}, {limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true} )
        if(filterDisponibility) return productsModel.paginate({status: filterDisponibility}, {limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true} )   
        if(filterCategory && filterDisponibility) return productsModel.paginate({category: filterCategory, status: filterDisponibility}, {limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true} )
        if(anyFilter) return productsModel.paginate(anyFilter,{limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true});
        return productsModel.paginate({},{limit: limitProducts, page: pageProducts, sort: {price: orderPrice}, lean: true});
    }

    //Method to obtain a product according to the sent parameter
    getBy = (param) => {
        return productsModel.findOne(param)
    }
    
    //Method to add a new product
    add = (product) => {
        return productsModel.create(product);
    }

    //Method to change selected product´s any fields 
    update = (productId, fieldsProduct) => {
        return productsModel.findByIdAndUpdate(productId, { $set: fieldsProduct })        
    }

    //Method to delete a product
    delete = (productId) => {
        return productsModel.findByIdAndDelete(productId)
    }   
}