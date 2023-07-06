import { privacy } from "../middlewares/auth.js";
import BaseRouter from "./router.js";
import viewsController from "../controllers/views.controller.js";



export default class ViewsRouter extends BaseRouter {
  init() {
    this.get("/", ["NO_AUTH"], viewsController.viewHome);

    this.get("/", ["NO_AUTH"], viewsController.viewProductsRealTime);

    this.get("/chat", ["NO_AUTH"], viewsController.viewChat);

    this.get("/products", ["PUBLIC"], privacy("PRIVATE"), viewsController.viewProducts);

    this.get("/carts/:cid", ["NO_AUTH"], viewsController.viewCart)

    this.get("/register" , ["NO_AUTH"], viewsController.viewRegist)
    
    this.get("/login", ["NO_AUTH"], viewsController.viewLogin)

  }
}

