import { faker } from "@faker-js/faker";

export const generateProduct = () => {

    const categories = ["Group one", "Group two", "Group three" ]

    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        status: faker.datatype.boolean(),
        _id:faker.database.mongodbObjectId(),
        stock: faker.number.int({min:0,max:20}),
        category: faker.helpers.arrayElement(categories),
        img: faker.image.urlLoremFlickr({ category: 'sports' })
    }    
}
