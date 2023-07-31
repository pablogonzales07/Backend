//External dependencies
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

//My dependencies
import __dirname from "./utils.js";
import { productsService } from "./services/repositories.js";
import initializePassportStrategies from './config/passport.config.js';
import registerChatHandler from "./listeners/chatHandle.js";
import SessionsRouter from "./routes/sessions.router.js";
import ProductsRouter from "./routes/productsMongo.js";
import  CartsRouter  from "./routes/cartsMongo.js";
import  ViewsRouter  from "./routes/views.router.js";
import TicketsRouter from "./routes/tickets.router.js";
import MockingRouter from "./routes/mocking.router.js";
import config from  './config.js';
import errorHandler from "./middlewares/error.js";
import attachLogger from "./middlewares/logger.js";


//I start the server and make it listen for changes in the selected port according to the environment.
const app = express();
const PORT = config.app.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = new Server(server);

//I connect my server whit the database(mongoDB)
const connection = mongoose.connect(config.mongo.URL);


//I define classic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());


app.use((req, res, next) => {
  req.io = io;
  next();
});

//Connect my server with the selected template engine
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//I start the strategies of passport
initializePassportStrategies();

app.use(attachLogger);

//Config the routes
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

//I capture any errors that occur
app.use(errorHandler);

app.get("/loggerTest", (req,res) => {
    req.logger.fatal("fatal");
    req.logger.error("error");
    req.logger.warning("warning");
    req.logger.info("info");
    req.logger.http("http");
    req.logger.debug("debug");
    res.send("LOGGER TEST")
})



//Message config
io.on("connection", async (socket) => {
  console.log("new client coneccting");
  const products = await productsService.getProducts();
  socket.emit("changeListProducts", products);
  registerChatHandler(io, socket);
});


