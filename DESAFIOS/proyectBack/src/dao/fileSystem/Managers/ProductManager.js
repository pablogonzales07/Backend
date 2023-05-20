import fs from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./proyectBack/files/products.json";
  }

  //method to obtain the products
  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const readProducts = await fs.promises.readFile(this.path, "utf-8");
      const listProducts = JSON.parse(readProducts);
      return listProducts;
    } else {
      return [];
    }
  };

  //method to add product
  addProducts = async ({
    title,
    description,
    price,
    thumbnail = [""],
    code,
    stock,
    status = false,
    category,
  }) => {
    try {
      //I obtain existing products
      const products = await this.getProducts();

      //I create the product
      const product = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };

      //I incorporate a dynamic id
      if (products.length === 0) {
        product.id = 0;
      } else {
        product.id = products[products.length - 1].id + 1;
      }
      products.push(product);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return product;
    } catch (error) {
      console.log(error);
    }
  };

  //return product by id
  getProductById = async (productId) => {
    const products = await this.getProducts();
    const productIndex = products.findIndex((item) => item.id === productId);
    if (productIndex === -1) {
      console.log("Not Found");
      return null;
    }

    const product = products[productIndex];
    console.log(product);
  };

  //method to change the value of the desired field
  updateProduct = async (productId, updateField, value) => {
    const products = await this.getProducts();
    const productIndex = products.findIndex((item) => item.id === productId);
    const itemUpdate = products[productIndex];
    itemUpdate[updateField] = value;
    products[productIndex] = itemUpdate;

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, "\t")
    );
    console.log(`the ${updateField} field was correctly changed to ${value}`);
    return itemUpdate;
  };

  //method to remove any product with the id
  deleteProduct = async (productId) => {
    const products = await this.getProducts();
    const itemToDelete = products.find((item) => item.id === productId);
    const newItems = products.filter(
      (products) => products.id != itemToDelete.id
    );
    fs.promises.writeFile(this.path, JSON.stringify(newItems, null, "\t"));
    console.log(`you have deleted the product: "${itemToDelete.title}"`);
    return itemToDelete;
  };
}
