const nombre = "mau";
const userName = nombre || "usuario";

//OPERADOR NULISH

const baños = 0;
const numBaños = baños ?? "sin definir"

console.log(numBaños);