import BaseRouter from "./router.js";
import cartsController from "../controllers/carts.controller.js";

export default class CartsRouter extends BaseRouter {
  init() {
    //Route to create a cart
    this.post("/", ["NO_AUTH"], cartsController.addCart);
  
    //Route to obtein the cart´s products
    this.get("/:cid", ["AUTH"], cartsController.getProductsCart);
    
    //Route for add products in the cart selected
    this.post("/:cid/product/:pid", ["AUTH"], cartsController.addProductsCart);

    //Route for delete a cart´s product selected
    this.delete("/:cid/product/:pid", ["AUTH"], cartsController.deleteProductCart);

    //Route for change the cart's products
    this.put("/:cid", ["AUTH"], cartsController.changeProductsCart);

    //Route for change the product's quantity in the cart selected
    this.put("/:cid/products/:pid", ["AUTH"], cartsController.changeQuantityProductCart);

    //Route for delete the products of the cart selected
    this.delete("/:cid", ["AUTH"], cartsController.deleteCartProducts);

    //Route to get all all the properties of the products in the selected cart
    this.get("/propertiesProducts/:cid", ["AUTH"], cartsController.obteinPropertiesProducts);
    
    //Route to change the stock of the products involved in the purchase.
    this.put("/:cid/purchase", ["AUTH"], cartsController.purchaseCart)
  }
}

