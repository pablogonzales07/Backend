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

router.delete("/:cid/product/:pid", async (req,res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const carts = await cartsService.getCarts();

    //i validate if the cart id selected is match whit any cart in the bd
    const cartExist = carts.find(item => item.id === cartId);
    if(!cartExist) return res.status(404).send({status: "Error", error: "Cart not found"});

    //valid if the product id matches any product in the cart
    const productsCart = await cartsService.getProductsCart({_id:cartId});
    const productExist = productsCart.find(item => item.product === productId);
    if(!productExist) return res.status(404).send({status: "Error", error: "Product not found in this cart"});

    await cartsService.deleteProductCart(cartId, productId);
    res.status(200).send({status: "Success", message: "Product was deleted correctly"})
})

router.put("/:cid/products/:pid", async (req,res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    const carts = await cartsService.getCarts();

    //i validate if the cart id selected is match whit any cart in the bd
    const cartExist = carts.find(item => item.id === cartId);
    if(!cartExist) return res.status(404).send({status: "Error", error: "Cart not found"});

    //valid if the product id matches any product in the cart
    const productsCart = await cartsService.getProductsCart({_id:cartId});
    const productExist = productsCart.find(item => item.product === productId);
    if(!productExist) return res.status(404).send({status: "Error", error: "Product not found in this cart"});

    productExist.quantity = newQuantity;
    cartExist.products = productsCart;
    await cartsService.updateQuantityCart(cartId, cartExist);
    res.status(200).send({status: "Success", message: "Product's quantity was changed correctly"})
})

router.delete("/:cid", async (req,res) => {
    const cartId = req.params.cid;
    const carts = await cartsService.getCarts();

    const cartExist = carts.find(item => item.id === cartId);
    if(!cartExist) return res.status(404).send({status: "Error", error: "Cart not found"});

    await cartsService.deleteAllProductsCart(cartId);
    res.status(200).send({status: "Success", message: "Product's were deleted correctly"})
})




export default router;