import usersController from "../controllers/users.controller.js"
import BaseRouter from "./router.js"
import uploader from "../services/uploader.js";

export default class UsersRouter extends BaseRouter {
    init() {
    //Route for obtein the user data
    this.get("/userProfile", ["AUTH"], usersController.getUser)

    //Route to modify the user role
    this.put("/premium/:uid", ["AUTH"], usersController.changeRoleUser);

    //Route for when the user consumes the discount code
    this.put("/codeUserAplicated", ["AUTH"], usersController.usingDiscountCode);

    //Route to add user documents
    this.post("/:uid/documents", ["AUTH"], uploader.fields([{ name: 'profileUser', maxCount: 1}, { name: 'productImage', maxCount: 1 }, { name: "accountStatus",  maxCount: 1}, { name: "proofAddress",  maxCount: 1}, { name: "userDni",  maxCount: 1}]), usersController.addUserDocuments)
    }
}
