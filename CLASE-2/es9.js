//SPREAD

const objetoA = {
    peras: 1,
    manzanas: 1,
    bananas: 2,
    fresas: 4
};

const objetoB = {
    duraznos: 2,
    uva: 4,
    ciruela: 6,
    fresas: 6
};

const objetoC = {
    ...objetoA,
    ...objetoB
}

//REST

const {peras, manzanas, ...frutasRestantes} = objetoA; //DESTRUCTURING









