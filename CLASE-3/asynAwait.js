const division = (dividendo, divisor) => {
  return new Promise((res, rej) => {
    if (divisor === 0) {
      rej("La operacion no se puede realizar ya quie se esta dividiendo por 0");
    } else {
      res(dividendo / divisor);
    }
  });
};

const contexto = async () => {
  try {
    const resultadoDePromesa = await division(10, 5);
    const resultadoAlterado = resultadoDePromesa + 10
    console.log(resultadoDePromesa);
    return resultadoAlterado
  } catch (error) {
    console.log(error);
  }
};

const superContexto = async () => {
  console.log("Iniciando Operacion");
  const resultadoDelContexto = await contexto();
  console.log("operacion terminada");

  console.log(resultadoDelContexto);


};

superContexto();
