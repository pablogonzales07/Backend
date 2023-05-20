import { Router } from "express";
import ProductsManager from "../dao/mongo/Managers/Products.js";

const router = Router();
const productsService = new ProductsManager();

router.get("/", async (req, res) => {
  try {
    const products = await productsService.getProducts();
    const limitProducts = req.query.limit;
    console.log(limitProducts);

    if (!limitProducts)
      return res.send({ status: "Succes", payload: products });
    const filterProducts = products.slice(0, limitProducts);   
    res.send({ status: "Succes", payload: filterProducts });
  } catch (error) {
    res.status(500).send(`Sorry something went wrong: ${error}`);
  }
});


router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const { title, description, code, price, status, stock, category } =
      newProduct;

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

    const codeExist = await productsService.getProductBy({ code: code });
    if (codeExist)
      return res
        .status(404)
        .send({ status: "Error", error: "Exist a product whit the same code" });

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
    res.send({
      status: "Success",
      message: "The product was added successfully",
    });
  } catch (error) {
    res.status(500).send(`Sorry we didn't add the product: ${error}`);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const products = await productsService.getProducts();
    const productId = req.params.pid;
    const productSelected = products.find(
      (product) => product.id === productId
    );
    if (!productSelected)
      return res
        .status(404)
        .send({
          status: "error",
          error: "Sorry was not find any product whit that id",
        });
    await productsService.getProductBy({ _id: productId });
    res.send({ status: "Succes", payload: productSelected });
  } catch (error) {
    res.status(500).send(`sorry something went wrong: ${error}`);
  }
});

router.put("/:pid", async (req,res) => {
    const productId = req.params.pid;
    const productUpdate = req.body;
    const products = await productsService.getProducts();

    const productExist = products.find(product => product.id === productId);
    if(!productExist) return res.status(404).send({status: "Error", error: "Not finded any product whit this id"});
    await productsService.updateProduct(productId, productUpdate);
    res.send({status:"Success", message:"The product was changed correctly"})
})



router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const products = await productsService.getProducts();

    const productExist = products.find(product => product.id === productId);
    if(!productExist) return res.status(404).send({status: "Error", error: "Not finded any product whit this id"});

    await productsService.deleteProduct(productId);
    res.send({status: "Succes", message: "The product was deleted correctly"})
});

export default router;
