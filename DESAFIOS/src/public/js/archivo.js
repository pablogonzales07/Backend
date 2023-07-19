const cartListProduct = document.getElementById("cartList");
const totalPriceValue= document.getElementById("totalPrice");
const buttonClearCart = document.getElementById("buttonClearCart");
const boxClearCart = document.getElementById("boxClearCart")


cartListProduct.innerHTML = `
                                <h4>Loading...</h4>
                            `

//I bring de user´s data
const data = async () => {
    //I bring de user´s data
    const responseUser = await fetch("/api/sessions/userProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    }); 
    const responseDataUser = await responseUser.json();

    //I bring de cart´s products
    const userCartId = responseDataUser.payload.cart
    const responseProductsCart = await fetch(`/api/carts/propertiesProducts/${userCartId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }, 
    })
    const responseDataCart = await responseProductsCart.json();

    //I create a new array of products
    const listProducts = responseDataCart.payload.products;
    if(listProducts.length > 0) {
   
        const newArrayProducts = listProducts.map(item => {
            return({
              title: item.product.title,
              price: item.product.price,
              img: item.product.img,
              quantity: item.quantity,
              id: item.product._id
            })
          })
          
        //I show the cart´s products in the view
        cartListProduct.innerHTML = ""
    
        newArrayProducts.map(item => {
            const boxCart = document.createElement("div");
            boxCart.className = "cartItem";
            boxCart.innerHTML = `
                                    <img src=${item.img} alt="">
                                    <h2>${item.title}</h2>
                                    <b>${item.price}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-currency-euro" viewBox="0 0 16 16">
                                        <path
                                        d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z" />
                                    </svg></b>
                                    <p>${item.quantity}</p>
                                    <button id=${item.id} class="deleteProduct">X</button>
                                `;
            cartListProduct.append(boxCart);
    
        //Logic for delete product selected in the cart
        const deleteProductCart = document.getElementById(item.id);
        deleteProductCart.addEventListener("click", async () => {
            const responseDeleteProduct = await fetch(`/api/carts/${userCartId}/product/${item.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                }, 
            }) 
            const responseDataDelete = await responseDeleteProduct.json();
            cartListProduct.innerHTML = ""
            if(responseDataDelete.status === "Success") {
                const newProductsCart = newArrayProducts.filter(products => products.id =! item.id);
                newProductsCart.map(product => {
                    const boxCart = document.createElement("div");
                    boxCart.className = "cartItem";
                    boxCart.innerHTML = `
                                            <img src=${product.img} alt="">
                                            <h2>${product.title}</h2>
                                            <b>${product.price}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                class="bi bi-currency-euro" viewBox="0 0 16 16">
                                                <path
                                                d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z" />
                                            </svg></b>
                                            <p>${product.quantity}</p>
                                            <button id=${product.id} class="deleteProduct">X</button>
                                        `;
                    cartListProduct.append(boxCart);
    
                    const newPrice = newProductsCart.reduce((acc, currentValue) =>{
                        return acc +=currentValue.price * currentValue.quantity
                    }, 0)
                    totalPriceValue.innerHTML = `
                                                    <p>The total price is ${newPrice}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    class="bi bi-currency-euro" viewBox="0 0 16 16">
                                                    <path
                                                    d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z" />
                                                    </svg></p>
                                                `         
                })
            }   
        })
        })
        
        //I add the total price of the cart
        const totalPrice = newArrayProducts.reduce((acc, currentValue) => {
            return acc +=currentValue.price * currentValue.quantity
          },0);
        
        totalPriceValue.innerHTML =  `
                                    <p>The total price is ${totalPrice}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-currency-euro" viewBox="0 0 16 16">
                                    <path
                                    d="M4 9.42h1.063C5.4 12.323 7.317 14 10.34 14c.622 0 1.167-.068 1.659-.185v-1.3c-.484.119-1.045.17-1.659.17-2.1 0-3.455-1.198-3.775-3.264h4.017v-.928H6.497v-.936c0-.11 0-.219.008-.329h4.078v-.927H6.618c.388-1.898 1.719-2.985 3.723-2.985.614 0 1.175.05 1.659.177V2.194A6.617 6.617 0 0 0 10.341 2c-2.928 0-4.82 1.569-5.244 4.3H4v.928h1.01v1.265H4v.928z" />
                                    </svg></p>
                                `
    
        buttonClearCart.addEventListener("click", async (req,res) => {
            console.log(userCartId);
            const response = await fetch(`/api/carts/${userCartId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                }
            }) 
    
            const responseData = await response.json();
            console.log(responseData);
            if(responseData.status === "Success") {
                cartListProduct.innerHTML = ` 
                                                <h4>the cart is empty</h4>
                                            ` ;
                totalPriceValue.innerHTML = ""
            }
        })
    } else {
        cartListProduct.innerHTML = ` 
                                        <h4>the cart is empty</h4>
                                    ` ;

    }
    
}

data();
