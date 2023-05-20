import cartsModel from "../models/cart.js";

export default class CartsManager {
  getCarts = () => {
    return cartsModel.find();
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
    return cartsModel.findByIdAndUpdate(idCart, {$set: cart})
  };
}
