import ManagerProductsMongo from "../dao/mongo/Managers/Products.js";
import ManagerCartsMongo from "../dao/mongo/Managers/Carts.js";

const productsService = new ManagerProductsMongo();
const cartsService = new ManagerCartsMongo();

const viewHome = async (req, res) => {
  //I bring the products
  const productsSale = await productsService.getProducts();
  const listProducts = productsSale.docs;

  res.render("home", {
    css: "home",
    title:"THE WORLD FITNESS-The site where you find everything from the gym world",
    logo: "/img/logo.png",
    header: "/img/header.jpg",
    headerTwo: "/img/header-dos.jpg",
    headerThree: "/img/header-tres.jpg",
    headerFour: "/img/header-cuatro.jpg",
    pictureOne: "/img/about-us-one.jpg",
    pictureTwo: "/img/about-us-two.jpg",
    products: listProducts,
  });
};

const viewProductsRealTime = async (req, res) => {
  res.render("chat");
};

const viewChat = async (req, res) => {
  res.render("chat");
};

const viewProducts = async (req, res) => {
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
};

const viewCart = async (req,res) => {
    const cartId = req.params.cid;
    const cartSelected = await cartsService.getCartById(cartId).populate("products.product");
    const productsCart = cartSelected.products
    res.render("carts", {productsCart, css: "cart"})
}

const viewRegist = async (req, res) => {
    res.render("register", {
        css: "register"
      }); 
}

const viewLogin = async (req, res) => {
    res.render("login", {
        css: "login"
      })
}

export default {
  viewHome,
  viewProductsRealTime,
  viewChat,
  viewProducts,
  viewCart,
  viewRegist,
  viewLogin
};
