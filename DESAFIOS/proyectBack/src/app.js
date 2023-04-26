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
  socket.on("message", async data => {
    const newProduct = await newProductManager.addProducts(data);
    io.emit("changeListProducts", newProduct);
  })
  socket.on("idMessage", async data => {
    
    const itemToDelete = await newProductManager.deleteProduct(parseInt(data));
    if(itemToDelete === null) {
      socket.emit("deleteProduct", { status: "error", error:"Not find product whit this id" })
    }else {
      io.emit("deleteProduct", itemToDelete)
    }
  })
})

