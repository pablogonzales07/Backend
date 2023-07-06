import CartManager from "../dao/mongo/Managers/Carts.js";
import BaseRouter from "./router.js";

const cartsService = new CartManager();

export default class CartsRouter extends BaseRouter {
  init() {
    //Route to create a cart
    this.post("/", ["NO_AUTH"], async (req, res) => {
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
    });

    //Route to obtein the cart´s products
    this.get("/:cid", ["NO_AUTH"], async (req, res) => {
      try {
        //i capture the product's id and i valid if the cart whit this id exist in the database
        const cartId = req.params.cid;
        const carts = await cartsService.getCarts();
        const cartExist = carts.find((cart) => cart.id === cartId);
        if (!cartExist)
          return res
            .status(404)
            .send({ status: "Error", error: "Cart not found" });

        //i send the product's what are they in this cart
        const products = await cartsService.getProductsCart({ _id: cartId });
        res.send({ status: "Success", payload: products });
      } catch (error) {
        return res.status(500).send({ status: "error", error: error });
      }
    });

    //Route for add products in the cart selected
    this.post("/:cid/product/:pid", ["NO_AUTH"], async (req, res) => {
      try {
        //i capture the data required
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        //valid if the cart id matches any cart in the database
        const carts = await cartsService.getCarts();
        const cartExist = carts.find((cart) => cart.id === cartId);
        if (!cartExist)
          return res
            .status(404)
            .send({ status: "Error", error: "cart not found" });

        //I bring the products and check if the product exists in the database
        const products = await cartsService.getProductsCart({ _id: cartId });
        const productExist = products.find(
          (item) => item.product == productId
        );
      
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
        await cartsService.addProductCart(cartId, cartExist);
        res.send({
          status: "Success",
          message: "Products were added correctly",
        });
      } catch (error) {
        return res.status(500).send({ status: "error", error: error });
      }
    });

    //Route for delete a cart´s product selected
    this.delete("/:cid/product/:pid", ["NO_AUTH"], async (req, res) => {
      try {
        //i capture the data required
        const cartId = req.params.cid;
        const productId = req.params.pid;

        //i validate if the cart id selected is match whit any cart in the bd
        const carts = await cartsService.getCarts();
        const cartExist = carts.find((item) => item.id === cartId);
        if (!cartExist)
          return res
            .status(404)
            .send({ status: "Error", error: "Cart not found" });

        //valid if the product id matches any product in the cart
        const productsCart = await cartsService.getProductsCart({
          _id: cartId,
        });
        const productExist = productsCart.find(
          (item) => item.product == productId
        );
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
    });

    //Route for change cart's products
    this.put("/:cid", ["NO_AUTH"],async (req, res) => {
      try {
        //i capture the required data
        const cartId = req.params.cid;
        const productsIngresed = req.body;
        //i validate if the cart id selected is match whit any cart in the bd
        const carts = await cartsService.getCarts();
        const cartExist = carts.find((item) => item.id === cartId);
        if (!cartExist)
          return res
            .status(404)
            .send({ status: "Error", error: "Cart not found" });

        //i change the product's in the cart
        await cartsService.updateCart(cartId, productsIngresed);
        const newCart = await cartsService
          .getCartById(cartId)
          .populate("products.product");
        res.send({ status: "Success", payload: newCart });
      } catch (error) {
        return res.status(500).send({ status: "error", error: error });
      }
    });

    //Route for change the product's quantity in the cart selected
    this.put("/:cid/products/:pid", ["NO_AUTH"], async (req, res) => {
      try {
        //i capture the required data
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        //i validate if the cart id selected is match whit any cart in the bd
        const carts = await cartsService.getCarts();
        const cartExist = carts.find((item) => item.id === cartId);
        if (!cartExist)
          return res
            .status(404)
            .send({ status: "Error", error: "Cart not found" });

        //valid if the product id matches any product in the cart
        const productsCart = await cartsService.getProductsCart({
          _id: cartId,
        });
        const productExist = productsCart.find(
          (item) => item.product == productId
        );
        if (!productExist)
          return res
            .status(404)
            .send({ status: "Error", error: "Product not found in this cart" });

        //I change the quantity of the product for the one sent
        productExist.quantity = newQuantity;
        cartExist.products = productsCart;
        await cartsService.updateQuantityCart(cartId, cartExist);
        res.status(200).send({
          status: "Success",
          message: "Product's quantity was changed correctly",
        });
      } catch (error) {
        return res.status(500).send({ status: "error", error: error });
      }
    });

    //Route for delete a cart selected
    this.delete("/:cid", ["NO_AUTH"], async (req, res) => {
      try {
        //i capture the required data
        const cartId = req.params.cid;

        //i validate if the cart id selected is match whit any cart in the bd
        const carts = await cartsService.getCarts();
        const cartExist = carts.find((item) => item.id === cartId);
        if (!cartExist)
          return res
            .status(404)
            .send({ status: "Error", error: "Cart not found" });

        //i delete all products in the cart
        await cartsService.deleteAllProductsCart(cartId);
        res
          .status(200)
          .send({
            status: "Success",
            message: "Product's were deleted correctly",
          });
      } catch (error) {
        return res.status(500).send({ status: "error", error: error });
      }
    });
  }
}

