
export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAllCarts = () => {
        return this.dao.get()
    }

    getCartById = (cartId) => {
        return this.dao.getById(cartId)
    }

    getProductsCart = (cartId) => {
        return this.dao.getProducts(cartId)
    }

    addCart = (cart) => {
        return this.dao.add(cart)
    }

    addProductsCart = (idCart, idProduct) => {
        return this.dao.addProduct(idCart, idProduct)
    }

    deleteProductCart = (idCart, idProduct) => {
        return this.dao.deleteProduct(idCart, idProduct)
    }

    updateQuntityProductsCart = (idCart, cart) => {
        return this.dao.updateQuantity(idCart, cart)
    }

    deleteProductsCart = (idCart) => {
        return this.dao.deleteAllProducts(idCart)
    }

    updateCart = (idCart, products) => {
        return this.dao.update(idCart, products)
    }

    propertiesProductsCart = (idCart) => {
        return this.dao.propertiesProducts(idCart)
    }             
}