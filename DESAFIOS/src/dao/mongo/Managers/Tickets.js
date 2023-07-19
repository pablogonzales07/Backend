import ticketModel from "../models/ticket.js";

export default class TicketsManager {
    get = () => {
        return ticketModel.find()
    }

    getBy = (param) => {
        return ticketModel.findOne(param)
    }

    add = (ticket) => {
        return ticketModel.create(ticket)
    }
}