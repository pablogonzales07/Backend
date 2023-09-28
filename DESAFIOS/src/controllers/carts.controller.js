import { cartsService, productsService } from "../services/repositories.js";

//Controller for add a new cart
const addCart = async (req, res) => {
  try {
    //I create the cart and then i send it
    const cart = {};
    const request = await cartsService.addCart(cart);
    res.sendPayload(request);
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for obtein the cart´s products
const getProductsCart = async (req, res) => {
  try {
    //I get the cart id and then validate if it exists in the database
    const cartId = req.params.cid;
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((cart) => cart.id === cartId);
    if (!cartExist) return res.notFounded("Cart not fount");

    //I send existing products in the cart
    const products = await cartsService.getProductsCart({ _id: cartId });
    res.sendPayload(products);
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for add products in a cart
const addProductsCart = async (req, res) => {
  try {
    //I get the data required
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    const user = req.user;

    //I verify if the cart id matches any cart in the database
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((cart) => cart.id === cartId);
    if (!cartExist) return res.badRequest("Cart not found");

    //I get the product that the customer wants to add
    const product = await productsService.getProductBy({ _id: productId });
    if (user.email === product.owner)
      return res.forbidden(
        "The user cannot add a product that belongs to him/her"
      );

    //I get the products and check if the product exists in the database
    const products = await cartsService.getProductsCart({ _id: cartId });
    const productExist = products.find((item) => item.product == productId);

    //If the product does not exist, the quantity of the product is one; otherwise, I add it to the existing amount
    if (productExist) {
      productExist.quantity += quantity;
    } else {
      const product = {
        product: productId,
        quantity: quantity,
      };
      products.push(product);
    }
    cartExist.products = products;
    //I add the products in the cart
    await cartsService.addProductsCart(cartId, cartExist);
    res.sendSuccess("Products were added correctly");
  } catch (error) {
    return res.errorServer(error);
  }
};

//Controller for delete a product in the cart selected
const deleteProductCart = async (req, res) => {
  try {
    //I get the data required
    const cartId = req.params.cid;
    const productId = req.params.pid;

    //I verify if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist) return res.notFounded("Cart not found")

    //I verify if the product id matches any product in the cart
    const productsCart = await cartsService.getProductsCart({
      _id: cartId,
    });
    const productExist = productsCart.find((item) => item.product == productId);
    if (!productExist) return res.badRequest("Product not found in this cart")

    //I delete the product's in the cart
    await cartsService.deleteProductCart(cartId, productId);
    res.sendSuccess("Product was deleted correctly");
  } catch (error) {
    res.errorServer(error);
  }
};

//Controller for change products in the cart selected
const changeProductsCart = async (req, res) => {
  try {
    //I get the required data
    const cartId = req.params.cid;
    const productsIngresed = req.body;

    //I verify if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist) return res.notFounded("Cart not found");

    //I change the product's in the cart
    await cartsService.updateCart(cartId, productsIngresed);
    const newCart = await cartsService.getCartById(cartId).populate("products.product");
    res.sendPayload(newCart)
  } catch (error) {
      return res.errorServer(error);
  }
};

//Controller for change the product´s quantity in the cart selected
const changeQuantityProductCart = async (req, res) => {
  try {
    //I get the required data
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    //I verify if the client send the required data
    if(!newQuantity) return res.badRequest("Incomplete data")

    //I verify if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist) return res.notFounded("Cart not found")

    //I verify if the product id matches any product in the cart
    const productsCart = await cartsService.getProductsCart({
      _id: cartId,
    });
    const productExist = productsCart.find((item) => item.product == productId);
    if (!productExist) return res.badRequest("Product not found in this cart")

    //I verify if the product quantity is the same to the new quantity sent it
    if(productExist.quantity == newQuantity) return res.badRequest("The quantities are equals")

    //I change the quantity of the product for the one sent
    productExist.quantity = newQuantity;
    cartExist.products = productsCart;
    await cartsService.updateQuntityProductsCart(cartId, cartExist);
    res.sendSuccess("Product's quantity was changed correctly")
  } catch (error) {
      return res.errorServer(error)
  }
};

//Controller for delete a cart products selected
const deleteCartProducts = async (req, res) => {
  try {
    console.log("fwefwfwef");
    //I get the required data
    const cartId = req.params.cid;

    //I verify if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist) return res.notFounded("Cart not found")

    //I delete all products in the cart
    await cartsService.deleteProductsCart(cartId);
    res.sendSuccess("Product's were deleted correctly")
  } catch (error) {
      return res.errorServer(error)
  }
};

//Controller to get all all the properties of the products in the selected cart
const obteinPropertiesProducts = async (req, res) => {
  try {
    //I get the required data
    const cartId = req.params.cid;
    const allCarts = await cartsService.getAllCarts();

    //I verify if the cartId it match whit any cart in the database
    const cartExist = allCarts.find((item) => item.id === cartId);
    if (!cartExist) return res.badRequest("Cart not found");

    //I get the product´s properties and then I send them
    const products = await cartsService.propertiesProductsCart(cartId);
    res.sendPayload(products);
  } catch (error) {
    res.errorServer(error);
  }
};

//Controller to change the stock of the products involved in the purchase
const purchaseCart = async (req, res) => {
  try {
    //I get the required data
    const cartId = req.params.cid;
    const allCarts = await cartsService.getAllCarts();

    //I verify if the cartId it match whit any cart in the database
    const cartExist = allCarts.find((item) => item.id === cartId);
    if (!cartExist) return res.badRequest("Cart not found");

    //I get the properties of the products
    const productsCart = await cartsService.propertiesProductsCart(cartId);
    const productsCartList = productsCart.products;

    //I separate the products that are in stock from those that are out of stock.
    const quantityNotAvailable = [];
    const quantityAvailable = [];
    for (let i = 0; i < productsCartList.length; i++) {
      const productSelected = productsCartList[i];
      if (productSelected.quantity > productSelected.product.stock) {
        quantityNotAvailable.push(productSelected);
      } else {
        quantityAvailable.push(productSelected);
        const newStock =
          productSelected.product.stock - productSelected.quantity;
        productSelected.product.stock = newStock;
        
        //I change the stock of purchased products
        await productsService.updateProduct(
          productSelected.product._id,
          productSelected.product
        );
      }
    }

    //I update the products of the cart whit the new stock of the products
    await cartsService.updateCart(cartId, quantityNotAvailable);

    //I calculate the total price of the products of the purchase
    const totalPrice = quantityAvailable.reduce((acc, currentValue) => {
      return (acc += currentValue.quantity * currentValue.product.price);
    }, 0);

    //I generate a pre-ticket to notify the user of out-of-stock products.
    const prePurchase = {
      totalPrice: totalPrice,
      productsAvailable: quantityAvailable,
      productsNotAvailable: quantityNotAvailable,
    };
    res.sendPayload(prePurchase);
  } catch (error) {
      return res.errorServer(error);
  }
};

export default {
  addCart,
  getProductsCart,
  addProductsCart,
  deleteProductCart,
  changeProductsCart,
  changeQuantityProductCart,
  deleteCartProducts,
  obteinPropertiesProducts,
  purchaseCart,
};
