
export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getAllTickets = () => {
        return this.dao.get()
    }

    getTicketBy = (param) => {
        return this.dao.getBy(param)
    }

    addNewTicket = (ticket) => {
        return this.dao.add(ticket)
    }
}