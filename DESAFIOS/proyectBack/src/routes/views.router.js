import ManagerProductsMongo from "../dao/mongo/Managers/Products.js";
import ManagerCartsMongo from "../dao/mongo/Managers/Carts.js";

import { privacy } from "../middlewares/auth.js";
import BaseRouter from "./router.js";

const productsService = new ManagerProductsMongo();
const cartsService = new ManagerCartsMongo();

export default class ViewsRouter extends BaseRouter {
  init() {
    this.get("/", ["NO_AUTH"], async (req, res) => {
      //I bring the products
      const productsSale = await productsService.getProducts();
      const listProducts = productsSale.docs;

      res.render("home", {
        css: "home",
        title:
          "Fitness-WORLD-shopONLINE-Your first motivation for start training-HOME",
        logo: "/img/logo.png",
        header: "/img/header.jpg",
        headerTwo: "/img/header-dos.jpg",
        headerThree: "/img/header-tres.jpg",
        headerFour: "/img/header-cuatro.jpg",
        pictureOne: "/img/about-us-one.jpg",
        pictureTwo: "/img/about-us-two.jpg",
        products: listProducts,
      });
    });

    this.get("/", ["NO_AUTH"], async (req, res) => {
      res.render("realTimeProducts", {
        css: "realTimeProducts",
      });
    });

    this.get("/chat", ["NO_AUTH"], async (req, res) => {
      res.render("chat");
    });

    this.get("/products", ["NO_AUTH"], privacy("PRIVATE"), async (req, res) => {
      const {
        page = 1,
        limit = 2,
        order,
        filterProducts,
        categoryFilter,
        statusFilter,
      } = req.query;
      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
        await productsService.getProducts(
          categoryFilter,
          statusFilter,
          filterProducts,
          limit,
          page,
          order
        );
      const products = docs;
      res.render("products", {
        products,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage,
        page: rest.page,
        css: "products",
        user: req.user,
      });
    });

    this.get("/carts/:cid", ["NO_AUTH"],async (req,res) => {
      const cartId = req.params.cid;
      const cartSelected = await cartsService.getCartById(cartId).populate("products.product");
      const productsCart = cartSelected.products
      res.render("carts", {productsCart, css: "cart"})
    })

    this.get("/register" , ["NO_AUTH"], async (req,res) => {
      res.render("register", {
        css: "register"
      });
    })
    
    this.get("/login", ["NO_AUTH"], async (req,res) => {
      res.render("login", {
        css: "login"
      })
    })

  }
}

