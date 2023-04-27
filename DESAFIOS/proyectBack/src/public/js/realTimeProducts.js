const formAddProduct = document.getElementById("formAddProduct");
const formDeleteProducts = document.getElementById("formDeleteProduct");
const listProductsConteiner = document.getElementById("listProducts");

console.log(formDeleteProducts);

const socket = io();

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

socket.on("changeListProducts", (data) => {
  if (typeof data === "string") return alert(data);
  let box = document.createElement("div");
  box.innerHTML = `
                        <div>
                        <b>${data.code}</b>
                        <div>
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                        <b>${data.price}</b>
                        </div>
                        <button id=${data.id}>Delete</button>
                    </div>
                    `;
  listProductsConteiner.append(box);
});

formDeleteProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = e.target.children;
  const itemToDelete = inputValue[0].value;
  socket.emit("deleteProduct", itemToDelete);
});

socket.on("deleteProductConfirmed", (data) => {
  if (typeof data === "string") return alert(data);
   const newListProducts = data;
   listProductsConteiner.innerHTML= "";
    newListProducts.forEach((item) => {
    let box = document.createElement("div");
    box.innerHTML = `
                        <div>
                            <b>${item.code}</b>
                            <div>
                                <h2>${item.title}</h2>
                                <p>${item.description}</p>
                                <b>${item.price}</b>
                            </div>
                            <button id=${item.id}>Delete</button>
                        </div>
                        `;
    listProductsConteiner.append(box);
  });
});
