import { Router } from "express";
import ProductManager from "../dao/fileSystem/Managers/ProductManager.js";

const router = Router();
const newProductManager = new ProductManager();

//endpoint that returns the products according to the limit sent in the request
router.get("/", async (req, res) => {
  try {
    const products = await newProductManager.getProducts();
    const limitProducts = req.query.limit;

    if (!limitProducts)
      return res.status(200).send({ status: "Succes", payload: products });
    const filterProducts = products.slice(0, limitProducts);
    res.status(200).send({ status: "Succes", payload: filterProducts });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: "Sorry Error to obtein the products" });
  }
});

//endpoint that returns the product according to the id entered by parameter
router.get("/:pid", async (req, res) => {
  try {
    const products = await newProductManager.getProducts();
    const findProduct = products.find((item) => item.id == req.params.pid);
    if (!findProduct)
      return res.status(400).send({
        status: "Error",
        error: "not finded none product whit this id",
      });
    res.send({ status: "Succes", payload: findProduct });
  } catch (e) {
    res.status(500).send({ status: "error", error: e });
  }
});

//endpoint for add a product
router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const { title, description, price, code, stock, status, category } =
      newProduct;

    const listProducts = await newProductManager.getProducts();
    //I valid if all fields they completed
    if (!title || !description || !price || !code || !stock || !status || !category) {
     return res.status(400).send({ status: "error", error: "You didn't complete all fields" });
    }

    //valid if they did not enter the same code
    let codeExist = listProducts.find((product) => product.code === code);
    if (codeExist) {
      return res.status(400).send({status: "error",error: "a product was found whit the same code",});
    }

    const request = await newProductManager.addProducts(newProduct);
    if (!request)
      return res
        .status(400)
        .send({ status: "mistake", error: "error sending data" });

    const newListProducts = await newProductManager.getProducts();
    req.io.emit("changeListProducts", newListProducts);
    res.send({ status: "success", message: "Product added" });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: `sorry something went wrong: ${error}` });
  }
});

//endopoint for change fields and your values

router.put("/:pid", async (req, res) => {
  try {
    const fieldToChange = Object.keys(req.body);
    const valueToChange = Object.values(req.body);
    const idProduct = parseInt(req.params.pid);
    const testRequest = [];

    //Valid if the id of the product they entered does not match any product
    const listProducts = await newProductManager.getProducts();
    const productIndex = listProducts.findIndex(
      (product) => product.id === idProduct
    );
    if (productIndex === -1)
      return res
        .status(400)
        .send({ status: "error", error: "The id not match whit any product" });

    //valid if the field to change is the id
    if (fieldToChange.includes("id"))
      return res
        .status(400)
        .send({ status: "error", error: "You can't change the field id" });

    //Valid if the required was sent
    if (!fieldToChange.length || !valueToChange.length)
      return res.status(400).send({
        status: "error",
        error: "error you didn't send required data",
      });

    for (let index = 0; index < fieldToChange.length; index++) {
      const request = await newProductManager.updateProduct(
        idProduct,
        fieldToChange[index],
        valueToChange[index]
      );

      testRequest.push(request);
    }

    //the last validation in case something went wrong
    if (testRequest.includes(null) || !testRequest.length)
      return res
        .status(400)
        .send({ status: "error", error: "error sending data" });

    res.send({ status: "success", message: "Product field changed" });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: `something went wrong: ${error}` });
  }
});

//endpoint to delete a product by id

router.delete("/:pid", async (req, res) => {
  try {
    const listProducts = await newProductManager.getProducts();
    const idProduct = parseInt(req.params.pid);

    //valid if the id exist
    const productExist = listProducts.find(
      (product) => product.id === idProduct
    );
    if (!productExist)
      return res
        .status(400)
        .send({
          status: "error",
          error: "the id doesn't match whit any product",
        });

    const request = await newProductManager.deleteProduct(idProduct);
    const products = newProductManager.getProducts();
    req.io.emit("changeListProducts", products);
    res.send({
      status: "succes",
      message: `the product ${request.title} was deleted correctly`,
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: `something was wrong: ${error}` });
  }
});

export default router;
