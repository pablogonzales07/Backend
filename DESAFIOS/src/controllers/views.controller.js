import jwt from "jsonwebtoken";
import {
  cartsService,
  productsService,
  usersService,
} from "../services/repositories.js";
import InfoAdmDTO from "../dtos/user/infoAdmDTO.js";
import config from "../config/config.js";

//Controller for the home´s view
const viewHome = async (req, res) => {
  //I bring the products
  const productsSale = await productsService.getAllProducts();
  const listProducts = productsSale.docs;
  const onlyAdminProducts = listProducts.filter(
    (products) => products.owner === "Admin"
  );
  const productsToShow = onlyAdminProducts.slice(0, 10);

  //I bring all the products from the selected cart
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const listProductsCart = getProductsCart.products;

  //I calculate the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I calculate the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  //I bring the session user
  const user = req.user;

  //I render the template whit the neccesary info
  res.render("home", {
    css: "home",
    title:
      "THE WORLD FITNESS-The site where you find everything from the gym world",
    logo: "/img/logo.png",
    header: "/img/header.jpg",
    headerTwo: "/img/header-dos.jpg",
    headerThree: "/img/header-tres.jpg",
    headerFour: "/img/header-cuatro.jpg",
    pictureOne: "/img/shop-one.jpg",
    pictureTwo: "/img/shop-two.jpg",
    products: productsToShow,
    countCart: countProductsCart,
    totalPrice: totalPrice,
    user: user,
  });
};

//Controller for show the view for user's cart
const viewCart = async (req, res) => {
  //I take the params
  const cartId = req.params.cid;

  //I bring all the products in the cart selected
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const listProductsCart = getProductsCart.products;

  //I calculate the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I calculate the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  //I bring the products in the cart along with their properties
  const productsCart = await cartsService.propertiesProductsCart(cartId);
  const listProducts = productsCart.products;

  //I render the template whit the neccesary info
  res.render("carts", {
    logo: "/img/logo.png",
    css: "cart",
    products: listProducts,
    totalPrice: totalPrice,
    countProductsCart: countProductsCart,
  });
};

//Controller to show the log view.
const viewRegist = async (req, res) => {
  //I render the template whit the neccesary info
  res.render("register", {
    css: "register",
  });
};

//Controller to show the login view
const viewLogin = async (req, res) => {
  //I render the template whit the neccesary info
  res.render("login", {
    css: "login",
  });
};

//Controller to show the product details view
const viewDetailProduct = async (req, res) => {
  //I bring the session user
  const user = req.user;

  //I take the productID sent by parameter
  const productId = req.params.pid;

  //I bring the products
  const allProducts = await productsService.getAllProducts();
  const listProducts = allProducts.docs;

  //I bring the products related to the chosen one
  const selectedProduct = await productsService.getProductBy({
    _id: productId,
  });
  const similarProducts = listProducts.filter(
    (items) => items.category === selectedProduct.category
  );
  const listDefinitive = similarProducts.filter(
    (items) => items.id !== selectedProduct.id
  );

  //I bring all the products in the cart selected
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const listProductsCart = getProductsCart.products;

  //I calculate the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I calculate the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  //I do destructuring the product selected for show later in the view
  const { title, description, code, img, stock, price, _id, cart, sizes } =
    await productsService.getProductBy({ _id: productId });

  //I render the template whit the neccesary info
  res.render("detailProduct", {
    css: "detailProduct",
    title,
    description,
    code,
    img,
    stock,
    price,
    id: _id,
    cartId: cart,
    logo: "/img/logo.png",
    countProductsCart: countProductsCart,
    totalCartPrice: totalPrice,
    listDefinitive,
    user: user,
    sizes: sizes,
  });
};

//Controller to show the restore password view
const viewRestorePassword = (req, res) => {
  //I take the user token
  const { token } = req.query;
  const around = config.app.AROUND === "dev" || null;
  try {
    //I verify if the user token is valid
    const validToken = jwt.verify(token, config.token.SECRET);

    //I render the template whit the neccesary info
    res.render("restorePassword", {
      around: around,
      css: "restorePassword",
    });
  } catch (error) {
    return res.render("invalidToken");
  }
};

//Controller to show the view for the categories of the products
const viewCategoryProducts = async (req, res) => {
  //I bring the neccesary data
  const categoryProducts = req.params.category;
  const user = req.user;
  const products = await productsService.getAllProducts();
  const listProducts = products.docs;

  //I separate the categories
  let tshirts = [];
  let shoes = [];
  let machines = [];
  let thermals = [];
  let dumbbells = [];
  let discs = [];
  let accesories = [];
  let bars = [];

  for (let i = 0; i < listProducts.length; i++) {
    let product = listProducts[i];
    if (product.category === "T-shirt") {
      tshirts.push(product);
    } else if (product.category === "Machine") {
      machines.push(product);
    } else if (product.category === "Shoes") {
      shoes.push(product);
    } else if (product.category === "Thermals") {
      thermals.push(product);
    } else if (product.category === "Dumbbells") {
      dumbbells.push(product);
    } else if (product.category === "Discs") {
      discs.push(product);
    } else if (product.category === "Gym-accesories") {
      accesories.push(product);
    } else if (product.category === "Bars") {
      bars.push(product);
    }
  }

  const productsSelected = listProducts.filter(
    (products) => products.category == categoryProducts
  );

  //I bring all the products in the cart selected
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const listProductsCart = getProductsCart.products;

  //I calculate the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I calculate the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  //I render the template whit the neccesary info
  res.render("categoryProducts", {
    css: "categoriesProducts",
    products: productsSelected,
    logo: "/img/logo.png",
    countProductsCart: countProductsCart,
    totalCartPrice: totalPrice,
    user: user,
    machines: machines.length,
    discs: discs.length,
    shoes: shoes.length,
    tshirts: tshirts.length,
    dumbbells: dumbbells.length,
    thermals: thermals.length,
    bars: bars.length,
    accesories: accesories.length,
    categorySelected: categoryProducts,
  });
};

//Controller to show ourShops view
const viewOurShops = async (req, res) => {
  //I bring the current session user
  const user = req.user;

  //I bring the cart products
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const onlyProducts = getProductsCart.products;

  //I calculate the total price of the cart and its quantity
  const totalPrice = onlyProducts.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  const totalQuantity = onlyProducts.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I render the template whit the neccesary info
  res.render("ourShops", {
    css: "ourShops",
    logo: "/img/logo.png",
    totalPriceCart: totalPrice,
    totalCountCart: totalQuantity,
    logoGymnasium: "/img/logo-gymnasium.png",
    logoFitnessPlace: "/img/logo-fitness-place.png",
    user: user,
  });
};

//Controller to show one of the stores(gymnasium)
const viewShopGymnasium = async (req, res) => {
  //I bring the current session user
  const user = req.user;

  //I bring the cart products
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const onlyProducts = getProductsCart.products;

  //I calculate the total price of the cart and its quantity
  const totalPrice = onlyProducts.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  const totalQuantity = onlyProducts.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I render the template whit the neccesary info
  res.render("gymnasium", {
    css: "gymnasium",
    logo: "/img/logo.png",
    imageOne: "/img/shop-two.jpg",
    imageTwo: "/img/gymnasium-one.jpg",
    imageThree: "/img/gymnasium-two.jpeg",
    user: user,
    cartPrice: totalPrice,
    cartQuantity: totalQuantity,
  });
};

//Controller to show one of the stores(Fitness place)
const viewShopFitnessPlace = async (req, res) => {
  //I bring the current session user
  const user = req.user;

  //I bring the cart products
  const getProductsCart = await cartsService
    .getCartById({ _id: req.user.cart })
    .populate("products.product");
  const onlyProducts = getProductsCart.products;

  //I calculate the total price of the cart and its quantity
  const totalPrice = onlyProducts.reduce((acc, currentValue) => {
    return (acc += currentValue.product.price * currentValue.quantity);
  }, 0);

  const totalQuantity = onlyProducts.reduce((acc, currentValue) => {
    return (acc += currentValue.quantity);
  }, 0);

  //I render the template whit the neccesary info
  res.render("fitnessPlace", {
    css: "fitnessPLace",
    logo: "/img/logo.png",
    imageOne: "img/shop-one.jpg",
    user: user,
    cartPrice: totalPrice,
    cartQuantity: totalQuantity,
  });
};

//Controller to show the user administration view
const viewAdministrationUser = async (req, res) => {
  //I bring users and turn them into an object with essential information
  const usersDB = await usersService.getAllUsers();
  const users = usersDB.map((product) => {
    return InfoAdmDTO.getFrom(product);
  });

  //I render the template whit the neccesary info
  res.render("administrationUser", {
    css: "administrationUser",
    logo: "/img/logo.png",
    users: users,
  });
};

//Controller to show the error view
const viewError404 = (req, res) => {
  //I render the template whit the neccesary info
  res.render("error404", {
    css: "error404",
  });
};

export default {
  viewHome,
  viewCart,
  viewRegist,
  viewLogin,
  viewDetailProduct,
  viewRestorePassword,
  viewCategoryProducts,
  viewOurShops,
  viewShopGymnasium,
  viewShopFitnessPlace,
  viewAdministrationUser,
  viewError404,
};
