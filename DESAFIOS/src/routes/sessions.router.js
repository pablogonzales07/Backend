import { passportCall } from "../services/auth.js";
import BaseRouter from "./router.js";
import sessionsController from "../controllers/sessions.controller.js";


export default class SessionsRouter extends BaseRouter {
  init() {
    //Route for register users
    this.post("/register", ["NO_AUTH"], passportCall("register",{strategyType:"locals"}), sessionsController.registUser)

    //Route for login user
    this.post("/login", ["NO_AUTH"], passportCall("login", {strategyType: "locals"}), sessionsController.loginUser)

    //Route for call github's route
    this.get("/github", ["NO_AUTH"], passportCall("github", {strategyType: "locals"}), sessionsController.callGitHubRoute);

    //Route for login whit github
    this.get("/githubcallback", ["NO_AUTH"], passportCall("github", {strategyType: "locals"}), sessionsController.loginGitHub)

    //Route for logout user
    this.post("/userLogout", ["AUTH"], sessionsController.logoutUser)

    //Route for password change request
    this.post("/restoreRequest", ["NO_AUTH"], sessionsController.restoreRequest);

    //Route for change the user password
    this.post("/restorePassword", ["NO_AUTH"], sessionsController.restorePassword);

  }
}

