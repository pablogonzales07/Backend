import BaseRouter from "./router.js";
import cartsController from "../controllers/carts.controller.js";



export default class CartsRouter extends BaseRouter {
  init() {
    //Route to create a cart
    this.post("/", ["NO_AUTH"], cartsController.addCart);

    //Route to obtein the cart´s products
    this.get("/:cid", ["NO_AUTH"], cartsController.getProductsCart);

    //Route for add products in the cart selected
    this.post("/:cid/product/:pid", ["NO_AUTH"], cartsController.addProductsCart);

    //Route for delete a cart´s product selected
    this.delete("/:cid/product/:pid", ["NO_AUTH"], cartsController.deleteProductCart);

    //Route for change cart's products
    this.put("/:cid", ["NO_AUTH"], cartsController.changeProductsCart);

    //Route for change the product's quantity in the cart selected
    this.put("/:cid/products/:pid", ["NO_AUTH"], cartsController.changeQuantityProductCart);

    //Route for delete a cart selected
    this.delete("/:cid", ["NO_AUTH"], cartsController.deleteCart);
  }
}

