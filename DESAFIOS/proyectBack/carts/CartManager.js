import fs from "fs";

export default class CartManager {
  constructor() {
    this.path = "./proyectBack/files/carts.json";
  }

  //method to obtain the carts
  getCarts = async () => {
    if (fs.existsSync(this.path)) {
      const readCarts = await fs.promises.readFile(this.path, "utf-8");
      const listCarts = JSON.parse(readCarts);
      return listCarts;
    } else {
      return [];
    }
  };

  //methos to obtain the products in a especific cart(id)
  getProductsCart = async (cartId) => {
    const carts = await this.getCarts();
    const indexCart = carts.findIndex((cart) => cart.id === cartId);
    if (indexCart === -1) {
      console.log("Sorry not found a cart whit this id");
      return null;
    }

    const cartSelected = carts[indexCart];
    const productsListed = cartSelected.products;
    return productsListed;
  };

  //method to add cart

  addCart = async () => {
    try {
      const carts = await this.getCarts();
      const cart = {
        products: [],
      };
      if (carts.length === 0) {
        cart.id = 0;
      } else {
        cart.id = carts[carts.length - 1].id + 1;
      }
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return cart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //method to add products in a especific cart.(only whit your id and quantity)
  addProductCart = async (idCart, idProduct, quantityProduct) => {
    const carts = await this.getCarts();
    const productsSelected = await this.getProductsCart(idCart);
    const indexCart = carts.findIndex((cart) => cart.id === idCart);

    if (!productsSelected) {
      console.log("Cart not found");
      return null;
    }

    const productExist = productsSelected.find(
      (item) => item.product === idProduct
    );
    if (productExist) {
      productExist.quantity += quantityProduct;
    } else {
      const product = {
        product: idProduct,
        quantity: quantityProduct,
      };
      productsSelected.push(product);
    }
    carts[indexCart].products = productsSelected;
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    return carts;
  };
}
