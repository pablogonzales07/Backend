import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductManager from "../products/ProductManager.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";


const app = express();

const server = app.listen(8080, () => {
  console.log("server listening on PORT 8080");
});
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const newProductManager = new ProductManager();

io.on("connection", socket => {
  console.log("new client coneccting");
  socket.on("message", async data => {
    const newProduct = await newProductManager.addProducts(data);
    if(newProduct === null) return socket.emit("changeListProducts", "We didn't add the product")
    io.emit("changeListProducts", newProduct);
  })
  socket.on("deleteProduct", async data => {
    const findItemToDelete = await newProductManager.deleteProduct(parseInt(data))
    if(findItemToDelete === null) return socket.emit("deleteProductConfirmed","Sorry we didn't delete the product selected");
    const newListProducts = await newProductManager.getProducts();
    io.emit("deleteProductConfirmed", newListProducts);
  } )
})

