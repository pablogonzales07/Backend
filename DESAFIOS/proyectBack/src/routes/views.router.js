import { Router } from "express";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";
import ManagerMongo from "../dao/mongo/Managers/Products.js"

const router = Router();
const newProductManager = new ProductManager();
const productsService = new ManagerMongo();

router.get("/", async (req, res) => {
  const products = await newProductManager.getProducts();
  res.render("home", {
    products,
    css: "home"
  });
});

router.get("/realTimeProducts", async (req,res) => {
  res.render("realTimeProducts", {
    css: "realTimeProducts"
  })
})

router.get("/chat", async (req,res) => {
  res.render("chat")
})

router.get("/products", async (req,res) => {
  const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, page} = await productsService.getProducts();
  const products = docs;
  res.render("products", {
    products,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    page  
  })

})

export default router;


