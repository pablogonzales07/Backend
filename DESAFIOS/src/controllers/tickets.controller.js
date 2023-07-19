import { ticketsService } from "../services/repositories.js";

const createTicket = async (req, res) => {
    try {
        //Valid if the customer sends all required data
        const ticketClient = req.body
        const {totalPricePurchase, emailUser, code, date} = ticketClient;
        if(!totalPricePurchase || !emailUser|| !code || !date) return errorUser("Data incomplete");

        //Valid if the code does not match any code in the database
        const codeExist = await ticketsService.getTicketBy({code: code});
        if(codeExist) return errorUser("Code exist in the database");

        //I create the ticket in the database
        const ticket = {
            code: code,
            purchase_datetime: date,
            amount: totalPricePurchase,
            purchaser: emailUser
        }

        const tiketGenerated = await ticketsService.addNewTicket(ticket);
        res.sendPayload(tiketGenerated)
    } catch (error) {
        return errorServer(500)
    }
}

export default {
    createTicket
}