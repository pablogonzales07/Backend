const arreglo = [1, 2, 3, 4];

const multiplicarPorDos = (valor) => valor * 2;

const nuevoArreglo = arreglo.map(multiplicarPorDos);


Array.prototype.funcionPropia = function(funcionCallback) {
    let nuevoArreglo = [];
    for(let i=0; i<this.length; i++) {
        let nuevoValor = funcionCallback(this[i]);
        nuevoArreglo.push(nuevoValor)
    }

    return nuevoArreglo
}


const arreglo2 = [1, 2, 3, 4, 5];

const arregloFinal = arreglo2.funcionPropia(multiplicarPorDos);

console.log(arregloFinal);