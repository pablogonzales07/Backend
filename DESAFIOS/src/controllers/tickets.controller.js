import DTemplates from "../constants/DTemplates.js";
import MailingService from "../services/mailingService.js";
import { ticketsService, usersService } from "../services/repositories.js";

//Controller fot generate a new purchase ticket
const createTicket = async (req, res) => {
  try {
    //I verify if the customer sends all required data
    const ticketClient = req.body;
    const { finalPrice, emailUser, code, date } = ticketClient;
    if (!finalPrice || !emailUser || !code || !date) return res.badRequest("Data incomplete");

    //I verify if the code does´t match any code in the database
    const codeExist = await ticketsService.getOneTicket({ code: code });
    if (codeExist) return res.badRequest("Code exist in the database");

    //I create the ticket
    const ticket = {
      code: code,
      purchase_datetime: date,
      amount: finalPrice,
      purchaser: emailUser,
    };
    const tiketGenerated = await ticketsService.addNewTicket(ticket);

    //I send to the usear an email whit the ticket
    const mailingService = new MailingService();
    const sendEmail = await mailingService.sendMail(emailUser, DTemplates.PURCHASE, {ticket: ticket})

    res.sendPayload(tiketGenerated);
  } catch (error) {
      console.log(error);
      return res.errorServer(500);
  }
};

//Controller for get all the tickets of purchase of the user 
const getTicketsUser = async (req, res) => {
  try {
    //I get the user
    const userId = req.params.uid;
    const user = await usersService.getUserBy({ _id: userId });

    //I obtein the user tickets and the i send it
    const tickets = await ticketsService.getTicketsBy({
      purchaser: user.email,
    });

    if (!tickets) return res.badRequest("The user hasn't tickets");
    res.sendPayload(tickets);
  } catch (error) {
    return res.errorServer(error);
  }
};

export default {
  createTicket,
  getTicketsUser,
};
