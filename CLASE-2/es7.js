//EXPONENCIAL

let valoresBase = [1, 2, 3, 4, 5, 6];
let nuevosValores = valoresBase.map((number, index) => number ** index);

console.log(nuevosValores);

//INCLUDES ARRAY

let nombres = ["Pablo", "Delfina", "Eva", "Nicolas"];

if (nombres.includes("Diego")) {
  console.log("Diego si esta en el grupo");
} else {
  console.log("Diego no esta en el grupo");
}
