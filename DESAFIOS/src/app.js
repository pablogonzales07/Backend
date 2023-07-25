//external dependencies
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import __dirname from "./utils.js";
import { productsService } from "./services/repositories.js";
import initializePassportStrategies from './config/passport.config.js';
import registerChatHandler from "./listeners/chatHandle.js";
import SessionsRouter from "./routes/sessions.router.js";
import ProductsRouter from "./routes/productsMongo.js";
import  CartsRouter  from "./routes/cartsMongo.js";
import  ViewsRouter  from "./routes/views.router.js";
import config from  './config.js';
import TicketsRouter from "./routes/tickets.router.js";
import MockingRouter from "./routes/mocking.router.js";
import errorHandler from "./middlewares/error.js"

const app = express();
const PORT = config.app.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = new Server(server);

const connection = mongoose.connect(config.mongo.URL);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cookieParser());

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

initializePassportStrategies();

const sessionsRouter = new SessionsRouter();
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const viewsRouter = new ViewsRouter();
const ticketsRouter = new TicketsRouter();
const mocksRouter = new MockingRouter()


app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/tickets", ticketsRouter.getRouter());
app.use("/", viewsRouter.getRouter());
app.use("/mockingproducts", mocksRouter.getRouter());

app.use(errorHandler);


io.on("connection", async (socket) => {
  console.log("new client coneccting");
  const products = await productsService.getProducts();
  socket.emit("changeListProducts", products);
  registerChatHandler(io, socket);
});


