import { Router } from "express";

import ManagerProductsMongo from "../dao/mongo/Managers/Products.js";
import ManagerCartsMongo from "../dao/mongo/Managers/Carts.js";
import { privacy } from "../middlewares/auth.js";

const router = Router();
const productsService = new ManagerProductsMongo();
const cartsService = new ManagerCartsMongo();

router.get("/", async (req, res) => {
  
  res.render("home", {
    css: "home",
    img: "/img/logo.png",
    gif: "/gifs/header.gif"
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

router.get("/products",privacy('PRIVATE'), async (req,res) => {
  const { page = 1, limit = 2, order, filterProducts, categoryFilter, statusFilter } = req.query;
  const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest} = await productsService.getProducts(categoryFilter, statusFilter, filterProducts, limit, page, order);
  const products = docs;
  res.render("products", {
    products,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
    page: rest.page,
    css: "products",
    user:req.session.user  
  })

})

router.get("/carts/:cid", async (req,res) => {
  const cartId = req.params.cid;
  const cartSelected = await cartsService.getCartById(cartId).populate("products.product");
  const productsCart = cartSelected.products
  res.render("carts", {productsCart, css: "cart"})
})

router.get("/register", privacy("NO_AUTHENTICATED"), async (req,res) => {
  res.render("register", {
    css: "register"
  });
})

router.get("/login",privacy("NO_AUTHENTICATED"), async (req,res) => {
  res.render("login", {
    css: "login"
  })
})
export default router;


