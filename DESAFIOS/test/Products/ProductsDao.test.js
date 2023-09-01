import mongoose from "mongoose";
import { expect } from "chai";

import ProductsManager from "../../src/dao/mongo/Managers/Products.js";

mongoose.connect(
  "mongodb+srv://pabloTrebotich:12345678910@eccomercedatabase.qejn1vy.mongodb.net/proyectTest?retryWrites=true&w=majority"
);

describe("Unit test productsDao", function () {
  this.timeout(4000);
  before(function () {
    this.productsDao = new ProductsManager();
  });

  beforeEach(function () {
    mongoose.connection.collections.products.drop();
  });

  it("You should successfully add the product in the database", async function () {
    const mockProduct = {
      title: "Test product",
      description: "I am a new test product",
      code: "123456",
      price: 100,
      stock: 1000,
      category: "TestProducts",
      img: "imageTestProduct",
    };

    const result = await this.productsDao.add(mockProduct);
    expect(result).to.have.property("_id");
  });

  it("Must bring the product that matches the entered field", async function () {
    const result = await this.productsDao.getBy({ code: "123456" });
    expect(result).to.be.ok;
  });

  it("Product should be able to update", async function () {
    const mockProduct = {
      title: "Test product two",
      description: "I am the second test product",
      code: "1234567",
      price: 100,
      stock: 1000,
      category: "TestProducts",
      img: "imageTestProduct",
    };
    const result = await this.productsDao.add(mockProduct);
    const updateProduct = await this.productsDao.update(result._id, {
      stock: 2000,
    });
    const newProduct = await this.productsDao.getBy({ stock: 2000 });
    expect(newProduct.stock).to.be.ok.and.to.be.equals(2000);
  });

  it("The product should be correctly removed from the database", async function () {
    const mockProduct = {
      title: "Test product three",
      description: "I am the third test product",
      code: "1234567",
      price: 100,
      stock: 1000,
      category: "TestProducts",
      img: "imageTestProduct",
    };
    const result = await this.productsDao.add(mockProduct);
    const deleteProduct = await this.productsDao.delete(result._id);
    const newProduct = await this.productsDao.getBy({
      title: "Test product three",
    });
    expect(!!newProduct).to.be.false;
  });
});
