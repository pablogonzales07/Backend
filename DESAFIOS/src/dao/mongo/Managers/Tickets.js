import ticketModel from "../models/ticket.js";

export default class TicketsManager {
    getAll = () => {
        return ticketModel.find()
    }

    getOne = (param) => {
        return ticketModel.findOne(param)
    }

    getBy = (param) => {
        return ticketModel.find(param)
    }

    add = (ticket) => {
        return ticketModel.create(ticket)
    }


}