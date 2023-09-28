
export default class TokenDTO {
    static getFrom = (user) => {
        return {
            name: user.name,
            role: user.role,
            email: user.email,
            cart: user.cartId,
            id: user.id,
            discountCode: user.discountCode
        }
    }
}