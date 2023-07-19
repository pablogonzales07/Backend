import UserRespository from "./Repositories/UserRepository.js";
import MessageRepository from "./Repositories/MessageRepository.js";
import ProductRepository from "./Repositories/ProductRepository.js";
import CartRepository from "./Repositories/CartRepository.js";
import TicketRepository from "./Repositories/TicketRepository.js";

import CartsManager from "../dao/mongo/Managers/Carts.js";
import ProductsManager from "../dao/mongo/Managers/Products.js";
import MessagesManager from "../dao/mongo/Managers/Messagges.js";
import UserManager from "../dao/mongo/Managers/users.js";
import TicketsManager from "../dao/mongo/Managers/Tickets.js";


export const usersService = new UserRespository(new UserManager());
export const cartsService = new CartRepository(new CartsManager());
export const productsService = new ProductRepository(new ProductsManager());
export const messagesService = new MessageRepository(new MessagesManager());
export const ticketsService = new TicketRepository(new TicketsManager());