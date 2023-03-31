class ProductManager {
  constructor() {
    this.products = [];
  }

  //method to obtain the products
  getProducts = () => this.products;

  //method to add product
  addProducts = ({ title, description, price, thumbnail, code, stock }) => {
    //valid if all fields are filled in
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("please complete all fields");
      return null;
    }
    //valid if the code already exists
    let codeExist = this.products.find((item) => item.code == code);
    if (codeExist) {
      console.log("a product was found with the same code");
      return null;
    }
    //I create the product
    const product = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    //I incorporate a dynamic id
    if (this.products.length === 0) {
      product.id = 0;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }
    this.products.push(product);
  };

  //return product by id
  getProductById = (productId) => {
    const productIndex = this.products.findIndex(
      (item) => item.id === productId
    );
    if (productIndex === -1) {
      console.log("Not Found");
      return null;
    }

    const product = this.products[productIndex];
    console.log(product);
  };
}

//test products:

const productManager = new ProductManager();

const productA = {
  title: "facu campazzo t-shirt",
  description : "facu campazzo original t-shirt",
  price: 15000,
  code: 123456,
  thumbnail : "pictureFacu.png",
  stock: 100
};

const productB = {
  title: "Luis Scola t-shirt",
  description : "Luis Scola original t-shirt",
  price: 17000,
  code: 1234567,
  thumbnail : "pictureLuis.png",
  stock: 100
};



productManager.addProducts(productA);
productManager.addProducts(productB);
console.log(productManager.getProducts());
productManager.getProductById(1);

