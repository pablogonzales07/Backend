
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAllProducts = (filterCategory, filterDisponibility, anyFilter, limitProducts, pageProducts, orderPrice) => {
        return this.dao.get(filterCategory, filterDisponibility, anyFilter, limitProducts, pageProducts, orderPrice)
    }

    getProductBy = (param) => {
        return this.dao.getBy(param)
    }

    addProduct = (product) => {
        return this.dao.add(product)
    }

    updateProduct = (productId, fieldsProduct) => {
        return this.dao.update(productId, fieldsProduct)
    }

    deleteProduct = (productId) => {
        return this.dao.delete(productId)
    }
}