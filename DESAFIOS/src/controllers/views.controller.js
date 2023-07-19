import { cartsService, productsService } from "../services/repositories.js";

const viewHome = async (req, res) => {
  //I bring the products
  const productsSale = await productsService.getAllProducts();
  const listProducts = productsSale.docs;

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
    countCart: countProductsCart,
    totalPrice: totalPrice
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
  //I capture the productID sent by parameter 
  const productId = req.params.pid;

  //I bring the products
  const allProducts = await productsService.getAllProducts();
  const listProducts = allProducts.docs
  
  //I bring the products related to the chosen one
  const selectedProduct = await productsService.getProductBy({_id: productId});
  const similarProducts = listProducts.filter(items => items.category === selectedProduct.category);

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
  const {title, description, code, img, stock, price, _id, cart} = await productsService.getProductBy({_id: productId});
 
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
    similarProducts
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
  viewDetailProduct
};
