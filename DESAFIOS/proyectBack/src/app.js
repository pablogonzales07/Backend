import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductManager from "./dao/fileSystem/Managers/ProductManager.js";
import productsMongoRouter from "./routes/productsMongo.js";
import cartsMongoRouter from "./routes/cartsMongo.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import registerChatHandler from "./listeners/chatHandle.js";

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const io = new Server(server);
const connection = mongoose.connect("mongodb+srv://pabloTrebotich:12345678910@eccomercedatabase.qejn1vy.mongodb.net/EcommerceProyect?retryWrites=true&w=majority")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/api/fs/products", productsRouter);
app.use("/api/fs/carts", cartsRouter);
app.use("/api/products", productsMongoRouter);
app.use("/api/carts", cartsMongoRouter);
app.use("/", viewsRouter);

const newProductManager = new ProductManager();

//I connect whit the client
io.on("connection", async (socket) => {
  console.log("new client coneccting");
  const products = await newProductManager.getProducts();
  socket.emit("changeListProducts", products);
  registerChatHandler(io,socket);
});
