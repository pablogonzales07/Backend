import { generateProduct } from "../mocks/products.mocks.js";

const getProducts = (req, res) => {
    const products = [];
    for(let i = 0; i < 100; i++) {
        products.push(generateProduct());
    }
    res.sendPayload(products);
}

export default {
    getProducts
}