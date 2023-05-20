import { Router } from "express";
import CartManager from "../dao/mongo/Managers/Carts.js";

const router = Router();
const cartsService = new CartManager();

router.post("/", async (req,res) => {
    try {
        const cart = {};
        const request = await cartsService.addCart(cart);
        res.send({status: "Succes", payload: request})
    } catch (error) {
        res.status(500).send({status: "Error", error: `Mistake in the BD : ${error}`})
    }
})

router.get("/:cid", async (req,res) => {
    const cartId = req.params.cid;
    const carts = await cartsService.getCarts();

    const cartExist = carts.find(cart => cart.id === cartId);
    if(!cartExist) return res.status(404).send({status: "Error", error: "Cart not found"});

    const products = await cartsService.getProductsCart({_id:cartId});
    res.send({status: "Success", payload: products })
})

router.post("/:cid/product/:pid", async (req,res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const carts = await cartsService.getCarts();
    
    const cartExist = carts.find(cart => cart.id === cartId);
    if(!cartExist) return res.status(404).send({status: "Error", error: "cart not found"});

    const products = await cartsService.getProductsCart({_id:cartId});
    const productExist = products.find(item => item.product === productId);
    
    if(productExist) {
        productExist.quantity += quantity;
    } else {
        const product = {
            product: productId,
            quantity: quantity
        }
        products.push(product);
    }

    cartExist.products = products;
    await cartsService.addProductCart(cartId, cartExist);
    res.send({status:"Success", message:"Products were added correctly" })
    
})





export default router;