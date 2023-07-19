import { productsService } from "../services/repositories.js";



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
      return res.badRequest("You didn't complete all fields");
    }

    //i valid if the the code not match whit any product in the database
    const codeExist = await productsService.getProductBy({ code: code });
    if (codeExist) return res.badRequest("Exist a product whit the same code");

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
    return res.errorServer(`Sorry we didn't add the product: ${error}`);
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
    if (!productExist)
      return res.notFounded("Not finded any product whit this id");

    //i change the product's fields and i send the response
    await productsService.updateProduct(productId, productUpdate);
    res.sendSuccess("The product was changed correctly");
  } catch (error) {
    res.errorServer(`error to change the product's fields: ${error}`);
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
    if (!productExist) return res.notFounded("Not finded any product whit this id");

    //i delete the product in the database
    await productsService.deleteProduct(productId);
    res.sendSuccess("The product was deleted correctly")
  } catch (error) {
    res.errorServer(`Sorry we don't delete the product: ${error}`);
  }
};

export default {
  getProducts,
  addProduct,
  changeFieldProduct,
  deleteProduct,
};
