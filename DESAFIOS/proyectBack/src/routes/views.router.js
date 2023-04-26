import { Router } from "express";
import ProductManager from "../../products/ProductManager.js";

const router = Router();
const newProductManager = new ProductManager();

router.get("/", async (req, res) => {
  const products = await newProductManager.getProducts();
  res.render("home", {
    products
  });
});

router.get("/realTimeProducts", async (req,res) => {
  const products = await newProductManager.getProducts();
  res.render("realTimeProducts", {
    products
  })
})

export default router;


