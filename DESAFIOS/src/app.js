//External dependencies
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

//My dependencies
import __dirname from "./utils.js";
import { productsService } from "./services/repositories.js";
import initializePassportStrategies from "./config/passport.config.js";
import registerChatHandler from "./listeners/chatHandle.js";
import SessionsRouter from "./routes/sessions.router.js";
import ProductsRouter from "./routes/productsMongo.js";
import CartsRouter from "./routes/cartsMongo.js";
import ViewsRouter from "./routes/views.router.js";
import TicketsRouter from "./routes/tickets.router.js";
import MockingRouter from "./routes/mocking.router.js";
import config from "./config/config.js";
import errorHandler from "./middlewares/error.js";
import attachLogger from "./middlewares/logger.js";
import UsersRouter from "./routes/users.router.js";

//I start the server and make it listen for changes in the selected port according to the environment.
const app = express();
const PORT = config.app.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = new Server(server);

//I connect my server whit the database(mongoDB)
const connection = mongoose.connect(config.mongo.URL);

//Documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "The world of the gym-online store",
      description: "API documentation: the world of the gym",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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

//I generate a logs middleware for using in my routes
app.use(attachLogger);

//Config the routes
const sessionsRouter = new SessionsRouter();
const usersRouter = new UsersRouter()
const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
const viewsRouter = new ViewsRouter();
const ticketsRouter = new TicketsRouter();
const mocksRouter = new MockingRouter();

app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/api/sessions", sessionsRouter.getRouter());
app.use("/api/users", usersRouter.getRouter());
app.use("/api/tickets", ticketsRouter.getRouter());
app.use("/", viewsRouter.getRouter());
app.use("/mockingproducts", mocksRouter.getRouter());

//I capture any errors that occur
app.use(errorHandler);

//Message config
io.on("connection", async (socket) => {
  console.log("new client coneccting");
  const products = await productsService.getProducts();
  socket.emit("changeListProducts", products);
  registerChatHandler(io, socket);
});
