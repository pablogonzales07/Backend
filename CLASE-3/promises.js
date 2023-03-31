const division = (dividendo, divisor) => {
    return new Promise((res, rej) => {
        if(divisor === 0) {
            rej("La operacion no se puede realizar ya quie se esta dividiendo por 0")
        }else {
            res(dividendo/divisor)
        }
    })
}


/* console.log(division(1,2)); */ //NO SE PUEDE

division(1,1)
.then(result => result +10)
.then(result => console.log(result))
.catch(err => console.log(err))


