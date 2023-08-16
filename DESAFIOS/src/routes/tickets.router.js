import ticketsController from "../controllers/tickets.controller.js";
import BaseRouter from "./router.js";

export default class TicketsRouter extends BaseRouter {
    init() {
        //Route for obtein all tickets according to the requested user
        this.get("/:uid", ["AUTH"], ticketsController.getTicketsUser )

        //Route for create a new ticket
        this.post("/", ["AUTH"], ticketsController.createTicket);
    }
}