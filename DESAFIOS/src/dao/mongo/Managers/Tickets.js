import ticketModel from "../models/ticket.js";

export default class TicketsManager {
    //Method to get all tickets
    getAll = () => {
        return ticketModel.find()
    }

    //Method to obteine a specific ticket
    getOne = (param) => {
        return ticketModel.findOne(param)
    }

    //Method to obtein a specific tickets
    getBy = (param) => {
        return ticketModel.find(param)
    }

    //Method to create a new ticket
    add = (ticket) => {
        return ticketModel.create(ticket)
    }
}