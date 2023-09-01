import jwt from "jsonwebtoken";
import { cartsService, productsService } from "../services/repositories.js";

const viewHome = async (req, res) => {
  //I bring the products
  const productsSale = await productsService.getAllProducts();
  const listProducts = productsSale.docs;
  const onlyAdminProducts = listProducts.filter(products => products.owner === "Admin");
  const productsToShow = onlyAdminProducts.slice(0, 10);

  //I bring all the products in the cart selected
  const getProductsCart = await cartsService.getCartById({_id: req.user.cart}).populate("products.product");
  const listProductsCart = getProductsCart.products

  
  //I add the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.quantity
  }, 0)

  //I add the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.product.price * currentValue.quantity
  },0);
  
  //I bring the user
  const user = req.user;

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
    products: productsToShow,
    countCart: countProductsCart,
    totalPrice: totalPrice,
    user: user
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
    await productsService.getAllProducts(
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

//controller to display the user's cart view
const viewCart = async (req,res) => {
  //I capture the params
  const cartId = req.params.cid;

  //I bring all the products in the cart selected
  const getProductsCart = await cartsService.getCartById({_id: req.user.cart}).populate("products.product");
  const listProductsCart = getProductsCart.products
  
  //I add the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.quantity
  }, 0)
  
  //I add the total price in the cart
   const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.product.price * currentValue.quantity
  },0);


  //I bring the products in the cart along with their properties
  const productsCart = await cartsService.propertiesProductsCart(cartId);
  const listProducts = productsCart.products;
  res.render("carts", {
    logo: "/img/logo.png",
    css: "cart",
    products: listProducts,
    totalPrice: totalPrice,
    countProductsCart: countProductsCart
  })
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

//controller to display the product details view
const viewDetailProduct = async (req, res) => {
  //I bring the user
  const user = req.user

  //I capture the productID sent by parameter 
  const productId = req.params.pid;

  //I bring the products
  const allProducts = await productsService.getAllProducts();
  const listProducts = allProducts.docs
  
  //I bring the products related to the chosen one
  const selectedProduct = await productsService.getProductBy({_id: productId});
  const similarProducts = listProducts.filter(items => items.category === selectedProduct.category);
  const listDefinitive = similarProducts.filter(items => items.id !== selectedProduct.id)
 
  //I bring all the products in the cart selected
  const getProductsCart = await cartsService.getCartById({_id: req.user.cart}).populate("products.product");
  const listProductsCart = getProductsCart.products

  //I add the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.quantity
  }, 0)

  //I add the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.product.price * currentValue.quantity
  },0);

  

  //I do destructuring the product selected for show later in the view
  const {title, description, code, img, stock, price, _id, cart, sizes} = await productsService.getProductBy({_id: productId});
  
  //Render the view whit the properties
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
    sizes: sizes
  })
}

const viewRestorePassword = (req, res) => {
  const { token } = req.query;
  try {
    const validToken = jwt.verify(token, "jwtUserSecret");
    res.render("restorePassword")
  } catch (error) {
      return res.render("invalidToken")
  }
  res.render("restorePassword")
}

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

  for(let i=0; i<listProducts.length; i++){
    let product = listProducts[i];
    if(product.category === "T-shirt") {
      tshirts.push(product)
    } else if(product.category === "Machine"){
      machines.push(product)
    }else if(product.category === "Shoes"){
      shoes.push(product)
    }else if(product.category === "Thermals"){
      thermals.push(product)
    }else if(product.category === "Dumbbells"){
      dumbbells.push(product)
    }else if(product.category === "Discs"){
      discs.push(product)
    }else if(product.category === "Gym-accesories"){
      accesories.push(product)
    }else if(product.category === "Bars"){
      bars.push(product)
    }
  }


  const productsSelected = listProducts.filter(products => products.category == categoryProducts);
  
  //I bring all the products in the cart selected
  const getProductsCart = await cartsService.getCartById({_id: req.user.cart}).populate("products.product");
  const listProductsCart = getProductsCart.products

  
  //I add the total number of products in the cart
  const countProductsCart = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.quantity
  }, 0)
  
    //I add the total price in the cart
  const totalPrice = listProductsCart.reduce((acc, currentValue) => {
    return acc +=currentValue.product.price * currentValue.quantity
  },0);
  
 
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
    categorySelected: categoryProducts
  })
}

export default {
  viewHome,
  viewProductsRealTime,
  viewChat,
  viewProducts,
  viewCart,
  viewRegist,
  viewLogin,
  viewDetailProduct,
  viewRestorePassword,
  viewCategoryProducts
};
