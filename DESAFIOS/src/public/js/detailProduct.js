//I bring the necessary elements
const buttonSubstract = document.getElementById("buttonSubstract");
const buttonAdd = document.getElementById("buttonAdd");
const countProducts = document.getElementById("countProducts");
const addToCart = document.getElementsByClassName("addToCartButton");
const buttonsContainer = document.getElementById("buttonsContainer");
const countCart = document.getElementById("countCart");
const priceCart = document.getElementById("totalPriceCart")

const buttonAddToCart = addToCart[0];


//Functionality to add
buttonAdd.addEventListener("click", () => {
    if(countProducts.innerHTML < 7) {
        const quantityProducts = parseInt(countProducts.innerHTML);
        countProducts.innerHTML = "";
        countProducts.innerHTML = quantityProducts + 1;
    }
})

//Functionality to substract
buttonSubstract.addEventListener("click", () => {
    if(countProducts.innerHTML > 1) {
        const quantityProducts = parseInt(countProducts.innerHTML);
        countProducts.innerHTML = "";
        countProducts.innerHTML = quantityProducts - 1;
    }
})

//Functionality for add the product selected in the cart
buttonAddToCart.addEventListener("click", async () => {
    //I bring the quantity product
    const quantityProduct = {quantity: parseInt(countProducts.innerHTML)};
    //I bring the product id
    const idProduct = addToCart[0].id;

    //Request to bring user data
    const responseUser = await fetch("/api/sessions/userProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    }); 
    const responseDataUser = await responseUser.json();

    //I save the user's cart id
    const userCartId = responseDataUser.payload.cart;

    //Request to add a new product in the cart
    const response = await fetch(`/api/carts/${userCartId}/product/${idProduct}`, {
        method: "POST",
        body: JSON.stringify(quantityProduct),
        headers: {
          "Content-Type": "application/json",
        },
    })
    const responseData = await response.json();
        //If the request is satisfactory 
    if(responseData.status === "Success"){
        Swal.fire({
            toast:true,
            position: 'top-end',
            showConfirmButton: false,
            timer:2000,
            title:`Product successfully added`,
            icon:"success"
        })
        buttonsContainer.innerHTML = 
                                    `
                                        <div class="buttonsNextShop">
                                            <button>
                                                <a href="/carts/${userCartId}">Go to cart</a>
                                            </button>
                                            <button>
                                                <a href="/">Continue shopping</a>
                                            </button>
                                        </div>
                                    `; 
    }

    //Request to bring de cart´t products
    const responseCart = await fetch(`/api/carts/propertiesProducts/${userCartId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    })  
    const responseDataCart = await responseCart.json();
    
    //I separate properties
    const products = responseDataCart.payload.products

    const listProductsCart = products.map(item => {
        return({
          title: item.product.title,
          price: item.product.price,
          img: item.product.img,
          quantity: item.quantity,
          id: item.product._id
        })
      })
    localStorage.setItem("cart", JSON.stringify(listProductsCart))
    
    //I change the value from the countProducts in the view
    const countCartProducts = products.reduce((acc, currentValue) => {
        return acc +=currentValue.quantity
    }, 0)
    countCart.innerHTML = countCartProducts

    //I change the value from the totalPrice in the view
    const totalPriceCart = products.reduce((acc, currentValue) => {
        return acc +=currentValue.product.price * currentValue.quantity
    }, 0)    
    priceCart.innerHTML = totalPriceCart

})
