import { expect } from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker";

import config from "../src/config/config.js";

const PORT = config.app.PORT;
const requester = supertest(`http://localhost:${PORT}`);

describe("Testing routes", function () {
  this.timeout(4000);
  before(function () {
    this.userMock = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 30 }),
      password: "123Pablo?",
    };
  });
  let cookie;
  describe("Sessions Router", async function () {
    it("The POST api/sessions/register must register the user", async function () {
      const mockUser = this.userMock;
      const response = await requester
        .post("/api/sessions/register")
        .send(mockUser);
      expect(response.status).to.be.equal(200);
    });
    it("The POST api/sessions/login must login the user", async function () {
      const mockUser = {
        email: this.userMock.email,
        password: this.userMock.password,
      };
      const response = await requester
        .post("/api/sessions/login")
        .send(mockUser);
      const cookieResult = response.headers["set-cookie"][0];
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.eql(config.cookie.SIGNATURE);
      expect(cookie.value).to.be.ok;
    });

    it("The POST api/sessions/restorePassword must logout the user", async function () {
      const userLogout = await requester
        .post("/api/sessions/userLogout")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(userLogout.status).to.be.equal(200);
    });
  });

  describe("Products routes", async function () {
    it("POST api/sessions/restorePassword should return code 400 when not completing all required fields", async function () {
      const mockProduct = {
        title: "Test product",
        description: "I am a new test product",
        code: "123456",
        price: 100,
        stock: 1000,
        category: "TestProducts",
        img: "imageTestProduct",
      };
      const response = await requester
        .post("/api/products")
        .send(mockProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(response.status).to.be.equals(400);
    });
  });
});
