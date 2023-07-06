import { Router } from "express";
import CartManager from "../dao/fileSystem/Managers/CartManager.js";


const router = Router();
const newCartManager = new CartManager();

//endpoint to get the products of a specific cart with its id
router.get("/:cid", async (req, res) => {
  const idCart = parseInt(req.params.cid);
  const request = await newCartManager.getProductsCart(idCart);

  if (!request)
    return res.status(400).send({ status: "error", error: "cart not found" });

  res.send(request);
});

//endponit to add a new cart whit automatic id anda especific products
router.post("/", async (req, res) => {
  const request = await newCartManager.addCart();
  if (!request)
    return res
      .status(500)
      .send({ status: "error", error: "mistake in the bd" });
  res.send({ status: "succes", message: "cart added correctly" });
});

//endpoint to add a new roduct whit your id and quantity in a especific cart
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantityProduct = parseInt(req.body.quantity) || 1;

  const request = await newCartManager.addProductCart(
    cartId,
    productId,
    quantityProduct
  );
  if (!request)
    return res.status(500).send({ status: "error", error: "not found cart" });

  res.send(request);
});

export default router;
