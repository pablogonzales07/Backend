//Error when not filling in all the required product fields
export const productsErrorIncompleteData = (product) => {
    return `Not all required product fields have been sent:
            Required data:
            *TITLE: a definite chain was expected and was received ${product.title}; 
            *DESCRIPTION: a definite chain was expected and was received ${product.description};
            *CODE: a definite chain was expected and was received ${product.code};
            *PRICE: a numerical value was expected and received ${product.price};
            *STATUS: a Boolean value was expected and received  ${product.status};
            *STOCK: a numerical value was expected and received ${product.stock};
            *CATEGORY: a definite chain was expected and was received ${product.category};
            *IMG: a definite chain was expected and was received ${product.img};
            `
};

//Error when the code entered is match whit some product in the data base
export const productsErrorCodeExist = (code) => {
    return `The product code matches one in the database
            *The product code sent is ${code}`
}

//Error when the entered id is not match whit any product
export const productsErrorIdNotFound = (productId) => {
    return `The product id is doesn't match whit any product in the dataBase
            *The product id sent is ${productId}
            `
}