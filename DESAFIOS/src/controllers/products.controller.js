import { productsService, usersService } from "../services/repositories.js";
import ErrorService from "../services/errorService.js";
import {
  notProductEmail,
  notProductUser,
  productsErrorCodeExist,
  productsErrorIdNotFound,
  productsErrorIncompleteData,
  productsErrorRoleUser,
  userProductNotMatch,
} from "../constants/ProductsErrors.js";
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
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      img,
      owner,
    } = newProduct;

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
        cause: productsErrorIncompleteData({
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          img,
        }),
        message: "Incomplete fields",
        code: EErrors.ICOMPLETE_DATA_REQUIRED,
        status: 400,
      });
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
        status: 400,
      });
    }

    //I check if the user is allowed to add a product
    const user = req.user;
    if (
      user.role.toUpperCase() !== "PREMIUM" &&
      user.role.toUpperCase() !== "ADMIN"
    ) {
      //Shot a error
      ErrorService.createError({
        name: "User is not allowed to create a product",
        cause: productsErrorRoleUser(user.role),
        message: "The user role is not authorized to create a product",
        code: EErrors.ROLE_USER_NOT_AUTHORIZED,
        status: 403,
      });
    }
    if (user.role.toUpperCase() === "PREMIUM" && !owner) {
      //Shot a error
      ErrorService.createError({
        name: "The client did not send the owner",
        cause: notProductEmail(user.email),
        message: "Being a premium user, you must send the owner of the product",
        code: EErrors.INCORRECT_DATA,
        status: 400,
      });
    }

    //I add the product depending on whether the user entered the owner
    if (owner) {
      const userEmail = owner;
      const user = await usersService.getUserBy({ email: userEmail });
      if (!user) {
        ErrorService.createError({
          name: "Invalid email",
          cause: userProductNotMatch(userEmail),
          message: "The email entered does not match the user",
          code: EErrors.INCORRECT_DATA,
          status: 400,
        });
      }
      const product = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        img,
        owner,
      };
      await productsService.addProduct(product);
      res.sendSuccess("The product was added successfully");
    } else {
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
    }
  } catch (error) {
    console.log(error);
    if (error.code === 1) return res.badRequest(error.name);
    if (error.code === 2) return res.badRequest(error.name);
    if (error.code === 4) return res.forbidden(error.name);
  }
};

//Controller for change product´s fields
const changeFieldProduct = async (req, res) => {
  try {
    //i capture the product's id and fields to change by parameter
    const productId = req.params.pid;
    const productUpdate = req.body;
    const user = req.user;

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
        status: 404,
      });
    }

    if (
      user.role.toUpperCase() !== "PREMIUM" &&
      user.role.toUpperCase() !== "ADMIN"
    ) {
      //Shot a error
      ErrorService.createError({
        name: "User is not allowed to modify a product",
        cause: productsErrorRoleUser(user.role),
        message: "The user role is not authorized to modify a product",
        code: EErrors.ROLE_USER_NOT_AUTHORIZED,
        status: 403,
      });
    }

    if (user.role.toUpperCase() === "ADMIN") {
      await productsService.updateProduct(productId, productUpdate);
      res.sendSuccess("The product was changed correctly");
    }
    if (user.email !== productExist.owner) {
      //Shot a error
      ErrorService.createError({
        name: "The user is not allowed to modify a product that does not belong to him",
        cause: notProductUser(user.email, productExist.owner),
        message:"The user is not allowed to modify a product which does not belong to him, check that the user's email and the product's email match",
        code: EErrors.PRODUCT_NOT_BELONG_USER,
        status: 403,
      });
    }
    //i change the product's fields and i send the response
    await productsService.updateProduct(productId, productUpdate);
    res.sendSuccess("The product was changed correctly");
  } catch (error) {
    console.log(error);
    if (error.code === 3) return res.notFounded(error.name);
    if (error.code === 4) return res.forbidden(error.name);
    if (error.code === 5) return res.forbidden(error.name);
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
        status: 404,
      });
    }

    const user = req.user;
    if (
      user.role.toUpperCase() !== "PREMIUM" &&
      user.role.toUpperCase() !== "ADMIN"
    ) {
      //Shot a error
      ErrorService.createError({
        name: "The user cannot delete the product",
        cause: productsErrorRoleUser(user.role),
        message: "The user role is not authorized to delete a product",
        code: EErrors.ROLE_USER_NOT_AUTHORIZED,
        status: 403,
      });
    }
    /* return res.errorUser("The user cannot delete the product"); */
    if (user.role.toUpperCase() === "ADMIN") {
      //i delete the product in the database
      await productsService.deleteProduct(productId);
      res.sendSuccess("The product was deleted correctly");
    }
    if (user.email !== productExist.owner) {
      //Shot a error
      ErrorService.createError({
        name: "The user is not allowed to delete a product that does not belong to him",
        cause: notProductUser(user.email, productExist.owner),
        message:"The user is not allowed to delete a product which does not belong to him, check that the user's email and the product's email match",
        code: EErrors.PRODUCT_NOT_BELONG_USER,
        status: 403,
      });
    }
    
    //i delete the product in the database
    await productsService.deleteProduct(productId);
    res.sendSuccess("The product was deleted correctly");
  } catch (error) {
    console.log(error);
    if (error.code === 3) return res.notFounded(error.name);
    if (error.code === 4) return res.forbidden(error.name);
    if (error.code === 5) return res.forbidden(error.name)
  }
};

export default {
  getProducts,
  addProduct,
  changeFieldProduct,
  deleteProduct,
};
