const formAddProduct = document.getElementById("formAddProduct");
const formDeleteProducts = document.getElementById("formDeleteProduct");
const listProductsConteiner = document.getElementById("listProducts");

const socket = io();

//i receive the fields and values of the form and i send the new product
formAddProduct.addEventListener("submit", (e) => {
  e.preventDefault();
  let inputs = e.target.children;
  const product = {
    title: inputs[0].value,
    description: inputs[1].value,
    price: inputs[2].value,
    thumbnail: inputs[3].value,
    code: inputs[4].value,
    stock: inputs[5].value,
    status: inputs[6].value,
    category: inputs[7].value,
  };
  socket.emit("message", product);
});

//I receive the new product and add it to the product container
socket.on("changeListProducts", (data) => {
  if (typeof data === "string") return alert(data);
  let box = document.createElement("div");
  box.className = "poductsCart"
  box.innerHTML = `
                      <div class="productsCart">
                        <div class="futureImage"></div>
                        <div class="cardsBody">
                          <h3>${data.title}</h3>
                          <p>${data.description}</p>
                          <b>${data.price}$</b>
                        </div>
                        <button id="${data.id}">ADD TO CART</button>
                      </div>
                    `;
  listProductsConteiner.append(box);
});

//i receive the product that de client wants to delete and i send to the server
formDeleteProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = e.target.children;
  const itemToDelete = inputValue[0].value;
  socket.emit("deleteProduct", itemToDelete);
});

//if the product exists on the server, I get all the products without the removed product
socket.on("deleteProductConfirmed", (data) => {
  if (typeof data === "string") return alert(data);
  const newListProducts = data;
  listProductsConteiner.innerHTML = "";
  newListProducts.forEach((item) => {
    let box = document.createElement("div");
    box.innerHTML = `
                      <div class="productsCart">
                        <div class="futureImage"></div>
                        <div class="cardsBody">
                          <h3>${item.title}</h3>
                          <p>${item.description}</p>
                          <b>${item.price}$</b>
                        </div>
                        <button id="${item.id}">ADD TO CART</button>
                      </div>
                    `;
    listProductsConteiner.append(box);
  });
});
