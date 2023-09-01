import usersController from "../controllers/users.controller.js"
import BaseRouter from "./router.js"


export default class UsersRouter extends BaseRouter {
    init() {
    //Route for obtein the user data
    this.get("/userProfile", ["AUTH"], usersController.getUser)

    //Route to modify the user role
    this.put("/premium/:uid", ["AUTH"], usersController.changeRoleUser);

    //Route for when the user consumes the discount code
    this.put("/codeUserAplicated", ["AUTH"], usersController.usingDiscountCode);
    }
}
