const listProductsConteiner = document.getElementById("listProducts");

//start the handshake:)
const socket = io();

//I receive the new product and add it to the product container
socket.on("changeListProducts", (data) => {
  const listProductsConteiner = document.getElementById("listProducts");
  let content = "";
  data.forEach((product) => {
    content += `
                 <div class="productsCart">
                  <div class="futureImage"></div>
                  <div class="cardsBody">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <b>${product.price}$</b>
                  </div>
                  <button id="${product.id}">ADD TO CART</button>
                 </div>
                `;
    listProductsConteiner.innerHTML = content
  });
});


