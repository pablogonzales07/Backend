import { Router } from "express";
import ProductsManager from "../dao/mongo/Managers/Products.js";

const router = Router();
const productsService = new ProductsManager();

router.get("/", async (req, res) => {
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
    } = await productsService.getProducts(
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
    res.status(500).send(`Sorry something went wrong: ${error}`);
  }
});

router.post("/", async (req, res) => {
  try {
    //I capture the product properties commanded by query params
    const newProduct = req.body;
    const { title, description, code, price, status, stock, category } =
      newProduct;

    //I valid if the all fields product are completed
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category
    ) {
      return res
        .status(400)
        .send({ status: "Error", error: "You didn't complete all fields" });
    }

    //i valid if the the code not match whit any product in the database
    const codeExist = await productsService.getProductBy({ code: code });
    if (codeExist)
      return res
        .status(404)
        .send({ status: "Error", error: "Exist a product whit the same code" });

    //i build the product and adding in the database
    const product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
    };
    await productsService.addProduct(product);

    res.status(200).send({
      status: "Success",
      message: "The product was added successfully",
    });
  } catch (error) {
    res.status(500).send(`Sorry we didn't add the product: ${error}`);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    //i capture the product's id send by parameter
    const productId = req.params.pid;

    //i valid if the produc't id its matches whit any product in the database
    const products = await productsService.getProducts();
    const productSelected = products.find(
      (product) => product.id === productId
    );
    if (!productSelected)
      return res.status(404).send({
        status: "error",
        error: "Sorry was not find any product whit that id",
      });

    //i send the product selected
    await productsService.getProductBy({ _id: productId });
    res.send({ status: "Succes", payload: productSelected });
  } catch (error) {
    res.status(500).send(`sorry something went wrong: ${error}`);
  }
});

router.put("/:pid", async (req, res) => {
  try {
    //i capture the product's id and fields to change by parameter
    const productId = req.params.pid;
    const productUpdate = req.body;

    //i valid if the product's id it's match whit something product in the database
    const products = await productsService.getProducts();
    const productExist = products.find((product) => product.id === productId);
    if (!productExist)
      return res
        .status(404)
        .send({
          status: "Error",
          error: "Not finded any product whit this id",
        });

    //i change the product's fields and i send the response
    await productsService.updateProduct(productId, productUpdate);
    res.send({
      status: "Success",
      message: "The product was changed correctly",
    });
  } catch (error) {
    res.status(500).send({status: "Error", error: `error to change the product's fields: ${error}`})
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    //i capture the product's id and i valid if match whit something product in the database
    const productId = req.params.pid;
    const products = await productsService.getProducts();  
    const productExist = products.find((product) => product.id === productId);
    if (!productExist)
      return res
        .status(404)
        .send({ status: "Error", error: "Not finded any product whit this id" });
  
    //i delete the product in the database
    await productsService.deleteProduct(productId);
    res.send({ status: "Succes", message: "The product was deleted correctly" });
  } catch (error) {
      res.status(500).send({status:"Error", error: `Sorry we don't delete the product: ${error}`})
  }
});

export default router;
