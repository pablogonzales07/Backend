import { Router } from "express";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";

const router = Router();
const newProductManager = new ProductManager();

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

export default router;


