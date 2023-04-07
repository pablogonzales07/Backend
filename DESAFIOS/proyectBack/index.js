import ProductManager from "./products/ProductManager.js";

const productManager = new ProductManager();

const context = async () => {
  const test = await productManager.getProducts();
  console.log(test);
  //test propducts
  let productA = {
    title: "T-shirt Facu Campazzo",
    description: "I present the original facu campazzo's t-shirt",
    price: 17850,
    thumbnail: "pictureFacu.png",
    code: 123456,
    stock: 100,
  };

  let productB = {
    title: "T-shirt Luis Scola",
    description: "I present the original Luis Scola t-shirt",
    price: 15100,
    thumbnail: "pictureLuis.png",
    code: 1234567,
    stock: 100,
  }
  
  //testing methods
  await productManager.addProducts(productA);
  await productManager.addProducts(productB);
  await productManager.getProductById(1);
  await productManager.deleteProduct(1);
  await productManager.updateProduct(0, "title", "T-shirt Nico Laprovittola");

  const newProducts = await productManager.getProducts();
  console.log(newProducts);
};

context();
