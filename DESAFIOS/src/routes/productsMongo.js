import BaseRouter from "./router.js";
import productsController from "../controllers/products.controller.js";

export default class ProductsRouter extends BaseRouter {
  init() {
    //Route to obtein the Products
    this.get("/", ["AUTH"], productsController.getProducts);

    //Route to add a product
    this.post("/", ["AUTH"], productsController.addProduct);

    //Route to change product´s fields
    this.put("/:pid", ["AUTH"], productsController.changeFieldProduct);

    //Route to delete a product
    this.delete("/:pid", ["AUTH"], productsController.deleteProduct);
  }
}

