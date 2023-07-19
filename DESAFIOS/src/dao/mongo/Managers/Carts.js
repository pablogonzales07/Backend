import cartsModel from "../models/cart.js";

export default class CartsManager {

  //Method to get all carts
  get = () => {
    return cartsModel.find();
  };

  //Method to get cart selected by id
  getById = (cartId) => {
    return cartsModel.findById(cartId).lean();
  };

  //Method to get cart´s cart according to the cart id entered
  getProducts = async (cartId) => {
    return cartsModel
      .findOne(cartId, { __v: 0, _id: 0 })
      .then((cart) => cart.products);
  };

  //Method to add a new cart
  add = (cart) => {
    return cartsModel.create(cart);
  };

  //Method to add products in the cart selected
  addProduct = (idCart, cart) => {
    return cartsModel.findByIdAndUpdate(idCart, { $set: cart });
  };

  //Method to delete a product in the cart selected
  deleteProduct = (idCart, idProduct) => {
    return cartsModel.updateOne(
      { _id: idCart },
      { $pull: { products: { product: idProduct } } }
    );
  };

  //Method to change de cart´s products quantity
  updateQuantity = (idCart, cart) => {
    return cartsModel.findByIdAndUpdate(idCart, { $set: cart });
  };

  //Method to delete all cart´s products
  deleteAllProducts = (idCart) => {
    return cartsModel.updateOne({ _id: idCart }, { $set: { products: [] } });
  };

  //Method to change cart
  update = (idCart, products) => {
    return cartsModel.updateOne(
      { _id: idCart },
      { $set: { products: products } }
    );
  };

  //Method to obtein product´s properties from the cart selected
  propertiesProducts = (idCart) => {
    return cartsModel.findById(idCart).populate("products.product").lean();
  }
}
