const suma = (num1, num2) => {
  return new Promise((res, rej) => {
    if (num1 === 0 || num2 === 0) rej("Error en la operacion");
    if (num1 + num2 < 0) rej("La suma debe ser mayor a 0");
    res(num1 + num2);
  });
};

const restar = (num1, num2) => {
  return new Promise((res, rej) => {
    if (num1 === 0 || num2 === 0) rej("Error en la operacion");
    if (num1 - num2 < 0) rej("La resta debe ser mayor a 0");
    res(num1 - num2);
  });
};

const multiplicacion = (num1, num2) => {
    return new Promise((res, rej) => {
        if(num1 < 0 || num2 < 0) rej("Los factores no pueden ser negativos");
        const resultado = num1 * num2;
        if(resultado < 0) rej("Solo valores positivos")
        res(resultado)
        
    })
}

const divicion = (num1, num2) => {
    return new Promise((res, rej) => {
        if(num2 === 0 ) rej("No se Puede dividir por 0");
        res(num1/num2)
    }) 
}


const calculos = async() => {    

    try {
        const resultadoSuma = await suma(2, 5);
        const resultadoResta = await restar(4, 3);
        const resultadoMultiplicacion = await multiplicacion(2,5);
        const resultadoDivision = await divicion(10, 3);
    
        console.log(resultadoSuma);
        console.log(resultadoResta);
        console.log(resultadoMultiplicacion);
        console.log(resultadoDivision);
        
    } catch (error) {
        console.log(error);
    }

}

calculos();