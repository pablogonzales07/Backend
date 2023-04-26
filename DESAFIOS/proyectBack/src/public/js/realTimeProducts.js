const formAddProduct = document.getElementById("formAddProduct");
const listProductsConteiner = document.getElementById("listProducts");
const formToDelete = document.getElementById("formDeleteProduct")

const socket = io();

formAddProduct.addEventListener("submit", (e) => {
 
    e.preventDefault();
    let inputs = e.target.children;
    const product = {
        title : inputs[0].value,
        description: inputs[1].value,
        price: inputs[2].value,
        thumbnail: inputs[3].value,
        code: inputs[4].value,
        stock: inputs[5].value,
        status: inputs[6].value,
        category: inputs[7].value,
    }
    console.log(product);
    socket.emit("message", product);
})


socket.on("changeListProducts", data => {
    if(data === null) return alert("El producto no pudo agregarse")
    let box = document.createElement("div");
    box.innerHTML = `
                        <div>
                        <b>${data.code}</b>
                        <div>
                        <h2>${data.title}</h2>
                        <p>${data.description}</p>
                        <b>${data.price}</b>
                        </div>
                        <button>Delete</button>
                    </div>
                    `;
    listProductsConteiner.append(box);
});







