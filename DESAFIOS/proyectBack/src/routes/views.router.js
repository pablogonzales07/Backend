import { Router } from "express";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";
import ManagerProductsMongo from "../dao/mongo/Managers/Products.js";
import ManagerCartsMongo from "../dao/mongo/Managers/Carts.js";

const router = Router();
const newProductManager = new ProductManager();
const productsService = new ManagerProductsMongo();
const cartsService = new ManagerCartsMongo();

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
  const { page = 1, limit = 2, order, filterProducts } = req.query;
  const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest} = await productsService.getProducts(filterProducts, limit, page, order);
  const products = docs;
  res.render("products", {
    products,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    page: rest.page,
    css: "products"  
  })

})

router.get("/carts/:cid", async (req,res) => {
  const cartId = req.params.cid;
  const cartSelected = await cartsService.getCartById(cartId).populate("products.product");
  const productsCart = cartSelected.products
  res.render("carts", {productsCart, css: "cart"})
})
export default router;


