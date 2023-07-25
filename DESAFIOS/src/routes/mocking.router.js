import mocksController from "../controllers/mocks.controller.js";
import BaseRouter from "./router.js";


export default class MockingRouter extends BaseRouter {
    init(){
        //Route for inserte 100 news users
        this.get("/", ["NO_AUTH"], mocksController.getProducts)
    }
}