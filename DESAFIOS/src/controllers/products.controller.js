import { productsService } from "../services/repositories.js";
import ErrorService from "../services/errorService.js";
import {  productsErrorCodeExist, productsErrorIdNotFound, productsErrorIncompleteData } from "../constants/ProductsErrors.js";
import EErrors from "../constants/EErrors.js";



//Controller for send the products
const getProducts = async (req, res) => {
  try {
    //i catch the params
    const limitProducts = req.query.limit;
    const pageProducts = req.query.page;
    const categoryFilter = req.body.category;
    const statusFilter = req.body.status;
    const filterProducts = req.body;
    let orderPrice = req.query.order;

    //i convert the parameters to sort values
    if (orderPrice === "asc") {
      orderPrice = 1;
    } else if (orderPrice === "desc") {
      orderPrice = -1;
    } else {
      orderPrice = null;
    }

    //I capture the properties of the pagination
    const {
      docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasNextPage,
      hasPrevPage,
    } = await productsService.getAllProducts(
      categoryFilter,
      statusFilter,
      filterProducts,
      limitProducts,
      pageProducts,
      orderPrice
    );

    //i answer the request
    res.status(200).send({
      status: "Success",
      payload: docs,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
    });
  } catch (error) {
    return res.errorServer(`Sorry something went wrong: ${error}`);
  }
};

//Controller for add product
const addProduct = async (req, res) => {
  try {
    //I capture the product properties commanded by query params
    const newProduct = req.body;
    const { title, description, code, price, status, stock, category, img } =
      newProduct;

    //I valid if the all fields product are completed
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !img
    ) {
      //Shot a error
       ErrorService.createError({
        name: "Incomplete product fields",
        cause: productsErrorIncompleteData({title, description, code, price, status, stock, category, img}),
        message: "Incomplete fields",
        code: EErrors.ICOMPLETE_DATA_REQUIRED,
        status: 400
      })
    }

    //i valid if the the code not match whit any product in the database
    const codeExist = await productsService.getProductBy({ code: code });
    if (codeExist) {
      //Shot a error
      ErrorService.createError({
        name: "The product code already exists",
        cause: productsErrorCodeExist(code),
        message: "The product code entered matches one in the database",
        code: EErrors.INCORRECT_DATA,
        status: 401
      })
    }

    //i build the product and adding in the database
    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      img,
    };
    await productsService.addProduct(product);

    res.sendSuccess("The product was added successfully");
  } catch (error) {
    if(error.code === 1) return res.badRequest(error.name);
    if(error.code === 2) return res.errorUser(error.name);
  }
};

//Controller for change product´s fields
const changeFieldProduct = async (req, res) => {
  try {
    //i capture the product's id and fields to change by parameter
    const productId = req.params.pid;
    const productUpdate = req.body;

    //i valid if the product's id it's match whit something product in the database
    const products = await productsService.getAllProducts();
    const productsList = products.docs;
    const productExist = productsList.find(
      (product) => product.id === productId
    );
    if (!productExist) {
      //Shot a error
      ErrorService.createError({
        name: "Not finded Product whit this id",
        cause: productsErrorIdNotFound(productId),
        message: "The product id entered matches one in the database",
        code: EErrors.NOT_FIND_DATA,
        status: 404
      })
    }
      
    //i change the product's fields and i send the response
    await productsService.updateProduct(productId, productUpdate);
    res.sendSuccess("The product was changed correctly");
  } catch (error) {
    if(error.code === 3) return res.notFounded(error.name);
  }
};

//Controller for delete a product
const deleteProduct = async (req, res) => {
  try {
    //i capture the product's id and i valid if match whit something product in the database
    const productId = req.params.pid;
    const products = await productsService.getAllProducts();
    const productsList = products.docs;
    const productExist = productsList.find(
      (product) => product.id === productId
    );
    if (!productExist) {
      //Shot a error
      ErrorService.createError({
        name: "Not finded Product whit this id",
        cause: productsErrorIdNotFound(productId),
        message: "The product id entered matches one in the database",
        code: EErrors.NOT_FIND_DATA,
        status: 404
      })
    }

    //i delete the product in the database
    await productsService.deleteProduct(productId);
    res.sendSuccess("The product was deleted correctly")
  } catch (error) {
    if(error.code === 3) return res.notFounded(error.name);
  }
};

export default {
  getProducts,
  addProduct,
  changeFieldProduct,
  deleteProduct,
};
