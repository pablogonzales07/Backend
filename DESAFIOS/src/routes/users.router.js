import usersController from "../controllers/users.controller.js";
import BaseRouter from "./router.js";
import uploader from "../services/uploader.js";

export default class UsersRouter extends BaseRouter {
  init() {
    //Route for obtein all the users
    this.get("/", ["ADMIN"], usersController.getAllUsers);

    //Route to obtain the user's information in the current session
    this.get("/userProfile", ["USER", "ADMIN", "PREMIUM"], usersController.getSessionUser);

    //Route for obtaining a specific user
    this.get("/:uid", ["ADMIN"], usersController.findUser)

    //Route to modify the user role to premium
    this.put("/premium/:uid", ["USER", "ADMIN"], usersController.changeRoleUserPremium);

    //Route to modify the user role to the selected one
    this.put("/changeRoleUser/:uid", ["ADMIN"], usersController.changeRoleUser)

    //Route for when the user consumes the discount code
    this.put("/codeUserAplicated", ["USER", "ADMIN", "PREMIUM"], usersController.usingDiscountCode);

    //Route to add user documents
    this.post(
      "/:uid/documents",
      ["USER", "ADMIN", "PREMIUM"],
      uploader.fields([
        { name: "profileUser", maxCount: 1 },
        { name: "productImage", maxCount: 1 },
        { name: "accountStatus", maxCount: 1 },
        { name: "proofAddress", maxCount: 1 },
        { name: "userDni", maxCount: 1 },
      ]),
      usersController.addUserDocuments
    );

    //Path to delete a user
    this.delete("/:uid", ["ADMIN"], usersController.deleteUser);
  }
}
