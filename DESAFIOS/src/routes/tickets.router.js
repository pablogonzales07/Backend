import ticketsController from "../controllers/tickets.controller.js";
import BaseRouter from "./router.js";

export default class TicketsRouter extends BaseRouter {
    init() {
        this.post("/", ["AUTH"], ticketsController.createTicket )
    }
}