import { cartsService, productsService } from "../services/repositories.js";



//Controller for add a cart
const addCart = async (req, res) => {
  try {
    //I create the cart
    const cart = {};
    const request = await cartsService.addCart(cart);
    res.send({ status: "Succes", payload: request });
  } catch (error) {
    res
      .status(500)
      .send({ status: "Error", error: `Mistake in the BD : ${error}` });
  }
};

//Controller for obtein the cart´s products
const getProductsCart = async (req, res) => {
  try {
    //i capture the product's id and i valid if the cart whit this id exist in the database
    const cartId = req.params.cid;
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((cart) => cart.id === cartId);
    if (!cartExist)
      return res.status(404).send({ status: "Error", error: "Cart not found" });

    //i send the product's what are they in this cart
    const products = await cartsService.getProductsCart({ _id: cartId });
    res.send({ status: "Success", payload: products });
  } catch (error) {
    return res.status(500).send({ status: "error", error: error });
  }
};

//Controller for add products in a cart
const addProductsCart = async (req, res) => {
  try {
    //i capture the data required
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    //valid if the cart id matches any cart in the database
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((cart) => cart.id === cartId);
    if (!cartExist)
      return res.status(404).send({ status: "Error", error: "cart not found" });

    //I bring the products and check if the product exists in the database
    const products = await cartsService.getProductsCart({ _id: cartId });
    const productExist = products.find((item) => item.product == productId);

    //if the product does not exist, the quantity of the product is one; otherwise, I add it to the existing amount
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

    //i add the products in the cart
    await cartsService.addProductsCart(cartId, cartExist);
    res.send({
      status: "Success",
      message: "Products were added correctly",
    });
  } catch (error) {
    return res.status(500).send({ status: "error", error: error });
  }
};

//Controller for delete a product in the cart selected
const deleteProductCart = async (req, res) => {
  try {
    //i capture the data required
    const cartId = req.params.cid;
    const productId = req.params.pid;

    //i validate if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist)
      return res.status(404).send({ status: "Error", error: "Cart not found" });

    //valid if the product id matches any product in the cart
    const productsCart = await cartsService.getProductsCart({
      _id: cartId,
    });
    const productExist = productsCart.find((item) => item.product == productId);
    if (!productExist)
      return res
        .status(404)
        .send({ status: "Error", error: "Product not found in this cart" });

    //i delete the product's in the cart
    await cartsService.deleteProductCart(cartId, productId);
    res.status(200).send({
      status: "Success",
      message: "Product was deleted correctly",
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error });
  }
};

//Controller for change products in the cart selected
const changeProductsCart = async (req, res) => {
  try {
    //i capture the required data
    const cartId = req.params.cid;
    const productsIngresed = req.body;
    //i validate if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist)
      return res.status(404).send({ status: "Error", error: "Cart not found" });

    //i change the product's in the cart
    await cartsService.updateCart(cartId, productsIngresed);
    const newCart = await cartsService
      .getCartById(cartId)
      .populate("products.product");
    res.send({ status: "Success", payload: newCart });
  } catch (error) {
    return res.status(500).send({ status: "error", error: error });
  }
};

//Controller for change the product´s quantity in the cart selected
const changeQuantityProductCart = async (req, res) => {
  try {
    //i capture the required data
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    //i validate if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist)
      return res.status(404).send({ status: "Error", error: "Cart not found" });

    //valid if the product id matches any product in the cart
    const productsCart = await cartsService.getProductsCart({
      _id: cartId,
    });
    const productExist = productsCart.find((item) => item.product == productId);
    if (!productExist)
      return res
        .status(404)
        .send({ status: "Error", error: "Product not found in this cart" });

    //I change the quantity of the product for the one sent
    productExist.quantity = newQuantity;
    cartExist.products = productsCart;
    await cartsService.updateQuntityProductsCart(cartId, cartExist);
    res.status(200).send({
      status: "Success",
      message: "Product's quantity was changed correctly",
    });
  } catch (error) {
    return res.status(500).send({ status: "error", error: error });
  }
};

//Controller for delete a cart products selected
const deleteCartProducts = async (req, res) => {
  try {
    //i capture the required data
    const cartId = req.params.cid;

    //i validate if the cart id selected is match whit any cart in the bd
    const carts = await cartsService.getAllCarts();
    const cartExist = carts.find((item) => item.id === cartId);
    if (!cartExist)
      return res.status(404).send({ status: "Error", error: "Cart not found" });

    //i delete all products in the cart
    await cartsService.deleteProductsCart(cartId);
    res.status(200).send({
      status: "Success",
      message: "Product's were deleted correctly",
    });
  } catch (error) {
    return res.status(500).send({ status: "error", error: error });
  }
};

//Controller for obtein all the product´s properties from the cart
const obteinPropertiesProducts = async (req, res) => {
  try {
      //I obtein the required data
      const cartId = req.params.cid;
      const allCarts = await cartsService.getAllCarts();

      //I verify if the cartId it match whit any cart in the database
      const cartExist = allCarts.find(item => item.id === cartId);
      if(!cartExist) return res.errorUser("Cart not found")

      //I bring the product´s properties and then I send them
      const products = await cartsService.propertiesProductsCart(cartId);
      res.sendPayload(products)
  } catch (error) {
      res.errorServer(error)
  }
}

//Controller to change products in the cart before checkout
const purchaseCart = async (req, res) => {
  try {
    //I obtein the required data
    const cartId = req.params.cid;
    const allCarts = await cartsService.getAllCarts();

    //I verify if the cartId it match whit any cart in the database
    const cartExist = allCarts.find(item => item.id === cartId);
    if(!cartExist) return res.errorUser("Cart not found");

    //I bring the product properties and then I change them.
    const productsCart = await cartsService.propertiesProductsCart(cartId);
    const productsCartList = productsCart.products;

    //I separate the products that are in stock from those that are out of stock.
    const quantityNotAvailable = [];
    const quantityAvailable = [];
    for(let i=0; i<productsCartList.length; i++){
        const productSelected = productsCartList[i];
        if(productSelected.quantity > productSelected.product.stock) {
            quantityNotAvailable.push(productSelected)
        } else {
            quantityAvailable.push(productSelected)
            const newStock = productSelected.product.stock - productSelected.quantity;
            productSelected.product.stock = newStock;
            //I change the stock of purchased products
            await productsService.updateProduct(productSelected.product._id, productSelected.product)
        }
    }

    //I update the cart products whit the new stock
    await cartsService.updateCart(cartId, quantityNotAvailable);

    //I calculate the total price of the products purchased.
    const totalPrice = quantityAvailable.reduce((acc, currentValue) => {
      return acc+= currentValue.quantity*currentValue.product.price
    }, 0)

    //I generate a pre-ticket to notify the user of out-of-stock products.
    const prePurchase = {
      totalPrice: totalPrice,
      productsAvailable: quantityAvailable,
      productsNotAvailable: quantityNotAvailable
    }
    
    res.sendPayload(prePurchase)
  } catch (error) {
    res.errorServer(error)
  }
}

export default {
  addCart,
  getProductsCart,
  addProductsCart,
  deleteProductCart,
  changeProductsCart,
  changeQuantityProductCart,
  deleteCartProducts,
  obteinPropertiesProducts,
  purchaseCart
};
