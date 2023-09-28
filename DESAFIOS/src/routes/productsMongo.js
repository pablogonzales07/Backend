import BaseRouter from "./router.js";
import productsController from "../controllers/products.controller.js";

export default class ProductsRouter extends BaseRouter {
  init() {
    //Route to obtein the Products
    this.get("/", ["ADMIN"], productsController.getProducts);

    //Route to add a product
    this.post("/", ["PREMIUM", "ADMIN"], productsController.addProduct);

    //Route to change product´s fields
    this.put("/:pid", ["ADMIN", "PREMIUM"], productsController.changeFieldProduct);

    //Route to delete a product
    this.delete("/:pid", ["ADMIN", "PREMIUM"], productsController.deleteProduct);
  }
}

