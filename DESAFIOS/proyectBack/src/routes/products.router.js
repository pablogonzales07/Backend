import { Router } from "express";
import ProductManager from "../../products/ProductManager.js";

const router = Router();
const newProductManager = new ProductManager();

//endpoint that returns the products according to the limit sent in the request
router.get("/", async (req, res) => {
  const products = await newProductManager.getProducts();
  console.log(products);
  const limitProducts = req.query.limit;

  if (!limitProducts) return res.send(products);
  const filterProducts = products.slice(0, limitProducts);
  res.send(filterProducts);
});

//endpoint that returns the product according to the id entered by parameter
router.get("/:pid", async (req, res) => {
  const products = await newProductManager.getProducts();
  const findProduct = products.find((item) => item.id == req.params.pid);
  if (!findProduct)
    return res.status(400).send({status: "Error", error:"not finded none product whit this id"});
  res.send(findProduct);
});

//endpoint for add a product
router.post("/", async (req, res) => {
  const newProduct = req.body;
  const request = await newProductManager.addProducts(newProduct);
  if (!request)
    return res
      .status(400)
      .send({ status: "mistake", error: "error sending data" });

  res.send({ status: "success", message: "Product added" });
});

//endopoint for change fields and your values

router.put("/:pid", async (req, res) => {
  const fieldToChange = Object.keys(req.body);
  const valueToChange = Object.values(req.body);
  const idProduct = parseInt(req.params.pid);
  const testRequest = [];

  if (!fieldToChange.length || !valueToChange.length)
    return res
      .status(400)
      .send({ status: "error", error: "error you didn't send required data" });

  for (let index = 0; index < fieldToChange.length; index++) {
    const request = await newProductManager.updateProduct(
      idProduct,
      fieldToChange[index],
      valueToChange[index]
    );

    testRequest.push(request);
  }

  if (testRequest.includes(null) || !testRequest.length)
    return res
      .status(400)
      .send({ status: "error", error: "error sending data" });

  res.send({ status: "success", message: "Product field changed" });
});

//endpoint to delete a product by id

router.delete("/:pid", async (req, res) => {
  const request = await newProductManager.deleteProduct(
    parseInt(req.params.pid)
  );
  if (!request)
    return res
      .status(400)
      .send({ status: "error", eror: "a product with that id was not found" });

  res.send({ status: "succes", message: "Product was deleted correctly" });
});

export default router;
