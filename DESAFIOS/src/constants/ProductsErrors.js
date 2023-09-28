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

//Error stock product
export const negativeStock = (stock) => {
    return `The user sent a stock less than 0
            The stock shipped was ${stock}
           `
}

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

//Error when the user role is not authorized to create a product
export const productsErrorRoleUser = (roleUser) => {
    return `The user role "${roleUser}" is not allowed to add, delete or modify a product
            The roles that allow this action are:
            *PREMIUM
            *ADMIN
            `
}

//User error when creating product
export const userProductNotMatch = (fieldUser) => {
    return `the email ${fieldUser} does not match the user of the session`
}

//Error when the user is not allowed to perform an action
export const notProductUser = (emailUser, emailProduct) => {
    return `The user is not allowed to modify or delete a product that does not belong to him
            The user email is ${emailUser};
            The product owner is ${emailProduct}
           `
}

//Error when the user did not send the email when creating a product
export const notProductEmail = (emailUser) => {
    return `the user did not send the email in the product
            the user was expected to enter the email in the "owner" field of the product: ${emailUser}
           `
}

//Error when user tries to enter an invalid owner email
export const anyEmilOwner = (emailUser, emailRequired) => {
    return `The email of the product owner must match the email of the current session of the person who created it.
            the email entered ${emailUser}, must match ${emailRequired}
            `
}

//Error when a user premium try change the product owner field
export const changeOwnerPremium = (owner, ownerTry) => {
    return `You cannot modify the owner field as a premium user. The owner is ${owner}
            An attempt was made to change the owner to ${ownerTry}
            `
}
 