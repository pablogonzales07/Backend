import mongoose from "mongoose";
import { expect } from "chai";

import CartsManager from "../../src/dao/mongo/Managers/Carts.js";

mongoose.connect(
  "mongodb+srv://pabloTrebotich:12345678910@eccomercedatabase.qejn1vy.mongodb.net/proyectTest?retryWrites=true&w=majority"
);

describe("Cart dao Test", function () {
  this.timeout(4000);
  before(function () {
    this.cartsDao = new CartsManager();
  });

  beforeEach(function () {
    mongoose.connection.collections.carts.drop();
  });

  it("You should create a cart", async function () {
    const result = await this.cartsDao.add();
    expect(result._id).to.be.ok;
  });

  it("You must bring the cart of the id provided", async function () {
    const result = await this.cartsDao.add();
    const getCart = await this.cartsDao.getById(result._id);
    expect(getCart).to.be.ok;
  });

  it("You should add a product correctly to the cart", async function () {
    const result = await this.cartsDao.add();
    const mockProduct = {
      id: "fefwefwef",
      quantity: 10,
    };
    result.products.push(mockProduct);
    const updateProduct = await this.cartsDao.addProduct(result._id, result);
    const getCart = await this.cartsDao.getById(updateProduct._id);
    expect(getCart.products.length).to.be.above(0);
  });
});
