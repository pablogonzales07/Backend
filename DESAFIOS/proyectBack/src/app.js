import express from "express";
import ProductManager from "../products/ProductManager.js";

const app = express();
const newProductManager = new ProductManager();

//endpoint that returns the products according to the limit sent in the request
app.get("/products", async (req, res) => {
  const products = await newProductManager.getProducts();
  const limitProducts = req.query.limit;

  if (!limitProducts) return res.send(products);
  const filterProducts = products.slice(0, limitProducts);
  res.send(filterProducts);
});

//endpoint that returns the product according to the id entered by parameter
app.get("/products/:pid", async (req, res) => {
  const products = await newProductManager.getProducts();
  const findProduct = products.find((item) => item.id == req.params.pid);
  if (!findProduct)
    return res.send("<h1>The id does not match any product</h1>");
  res.send(findProduct);
});
app.listen(8080, () => {
  console.log("server listening on PORT 8080");
});
