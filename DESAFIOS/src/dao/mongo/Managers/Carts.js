import cartsModel from "../models/cart.js";

export default class CartsManager {
  getCarts = () => {
    return cartsModel.find();
  };

  getCartById = (cartId) => {
    return cartsModel.findById(cartId).lean();
  };

  getProductsCart = async (cartId) => {
    return cartsModel
      .findOne(cartId, { __v: 0, _id: 0 })
      .then((cart) => cart.products);
  };

  addCart = (cart) => {
    return cartsModel.create(cart);
  };

  addProductCart = (idCart, cart) => {
    return cartsModel.findByIdAndUpdate(idCart, { $set: cart });
  };

  deleteProductCart = (idCart, idProduct) => {
    return cartsModel.updateOne(
      { _id: idCart },
      { $pull: { products: { product: idProduct } } }
    );
  };

  updateQuantityCart = (idCart, cart) => {
    return cartsModel.findByIdAndUpdate(idCart, { $set: cart });
  };

  deleteAllProductsCart = (idCart) => {
    return cartsModel.updateOne({ _id: idCart }, { $set: { products: [] } });
  };

  updateCart = (idCart, products) => {
    return cartsModel.updateOne(
      { _id: idCart },
      { $set: { products: products } }
    );
  };
}
