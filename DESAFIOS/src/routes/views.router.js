import BaseRouter from "./router.js";
import viewsController from "../controllers/views.controller.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    this.get("/", ["AUTH"], viewsController.viewHome);

    this.get("/", ["NO_AUTH"], viewsController.viewProductsRealTime);

    this.get("/ourShops", ["AUTH"], viewsController.viewOurShops);

    this.get("/shopGymnasium", ["AUTH"], viewsController.viewShopGymnasium);

    this.get("/shopFitnessPlace", ["AUTH"], viewsController.viewShopFitnessPlace);

    this.get("/chat", ["AUTH"], viewsController.viewChat);

    this.get("/carts/:cid", ["AUTH"], viewsController.viewCart);

    this.get("/register" , ["NO_AUTH"] ,viewsController.viewRegist);
    
    this.get("/login", ["NO_AUTH"], viewsController.viewLogin);

    this.get("/detail/:pid", ["AUTH"], viewsController.viewDetailProduct);

    this.get("/restorePassword", ["NO_AUTH"], viewsController.viewRestorePassword);

    this.get("/categories/:category", ["AUTH"], viewsController.viewCategoryProducts);

    this.get("/admnistrationUsers", ["ADMIN"], viewsController.viewAdministrationUser);

    this.get("/error404", ["AUTH"], viewsController.viewError404);

  }
}

