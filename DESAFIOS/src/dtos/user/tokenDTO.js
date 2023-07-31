
export default class TokenDTO {
    constructor(user) {
        this.name = user.name,
        this.role = user.role,
        this.email = user.email,
        this.cart = user.cartId,
        this.id = user.id 
    }
}