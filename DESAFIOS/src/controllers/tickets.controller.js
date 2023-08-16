import { ticketsService, usersService } from "../services/repositories.js";

const createTicket = async (req, res) => {
  try {
    //Valid if the customer sends all required data
    const ticketClient = req.body;
    const { finalPrice, emailUser, code, date } = ticketClient;
    if (!finalPrice || !emailUser || !code || !date)
      return errorUser("Data incomplete");

    //Valid if the code does not match any code in the database
    const codeExist = await ticketsService.getOneTicket({ code: code });
    if (codeExist) return errorUser("Code exist in the database");
    //I create the ticket in the database
    const ticket = {
      code: code,
      purchase_datetime: date,
      amount: finalPrice,
      purchaser: emailUser,
    };

    const tiketGenerated = await ticketsService.addNewTicket(ticket);
    res.sendPayload(tiketGenerated);
  } catch (error) {
    return errorServer(500);
  }
};

const getTicketsUser = async (req, res) => {
  try {
    //I bring the user
    const userId = req.params.uid;
    const user = await usersService.getUserBy({ _id: userId });

    //I bring user tickets
    const tickets = await ticketsService.getTicketsBy({
      purchaser: user.email,
    });
    if (!tickets) return res.errorUser("The user hasn't tickets");

    res.sendPayload(tickets);
  } catch (error) {
    res.errorServer(error);
  }
};

export default {
  createTicket,
  getTicketsUser,
};
