class Contador {
  constructor(responsable) {
    this.nombre = responsable;
    this.conteo = 0;
  }
  static conteoGlobal = 0;
  getResponsable = () => {
    return this.responsable;
  };
  contar = () => {
    this.conteo++;
    Contador.conteoGlobal++;
  };
  getCuentaIndividual = () => {
    return this.conteo;
  }
  getCuentaGlobal = () => {
    return Contador.conteoGlobal;
  }
}

const contador1 = new Contador("Carlos");
const contador2 = new Contador("Julia");
const contador3 = new Contador("Maricarmen");
const contador4 = new Contador("Pablo")

console.log(contador1.getCuentaIndividual());
contador1.contar();
console.log(contador1.getCuentaIndividual());
console.log(contador2.getCuentaIndividual());

contador3.contar()
console.log(contador3.getCuentaIndividual());

contador2.contar();
contador2.contar();
contador2.contar();
contador2.contar();

console.log(contador2.getCuentaIndividual());



console.log(contador4.getCuentaGlobal());



