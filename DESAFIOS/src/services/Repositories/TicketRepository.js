
export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAllTickets = () => {
        return this.dao.getAll()
    }

    getOneTicket = (ticketField) => {
        return this.dao.getOne(ticketField)
    }

    getTicketsBy = (param) => {
        return this.dao.getBy(param)
    }

    addNewTicket = (ticket) => {
        return this.dao.add(ticket)
    }
}