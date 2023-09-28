//I bring the necessary elements
const buttonSubstract = document.getElementById("buttonSubstract");
const buttonAdd = document.getElementById("buttonAdd");
const countProducts = document.getElementById("countProducts");
const addToCart = document.getElementsByClassName("addToCartButton");
const buttonsContainer = document.getElementById("buttonsContainer");
const countCart = document.getElementById("countCart");
const priceCart = document.getElementById("totalPriceCart");
const buttonsSize = document.querySelectorAll(".buttonSize");

document.getElementById("hambButton").addEventListener("click", function() {
  document.querySelector(".horizontalMenu").classList.toggle("active");
});

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


//Functionality in case the product has sizes
let size;
if(buttonsSize) {
  buttonsSize.forEach(button => {
    button.addEventListener('click', () => {
      buttonsSize.forEach(btn => {
        btn.classList.remove('clicked');
      });
      button.classList.add('clicked');
      if(button.classList.length > 1) {
        size = button.id
      } else {
        size = "Sin talle"
      }
    });
  })
}

//Functionality for add the product selected in the cart
buttonAddToCart.addEventListener("click", async () => {
    //I bring the quantity product
    const quantityProduct = {quantity: parseInt(countProducts.innerHTML)};
    //I bring the product id
    const idProduct = addToCart[0].id;
    
    //Request to bring user data
    const responseUser = await fetch("/api/users/userProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
    }); 
    const responseDataUser = await responseUser.json();

    //I save the user's cart id
    const userCartId = responseDataUser.payload.cart;

    if(buttonsSize.length>0 && !size) return alert("Seleccione un talle por favor")

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

//I generate an event to display a sideBar with all user data
document.getElementById("toggleButton").addEventListener("click", function () {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.right === "-400px") {
      sidebar.style.right = "0";
    } else {
      sidebar.style.right = "-400px";
    }
  });
  
  //I generate an event to close de sideBar
  document.getElementById("closeButton").addEventListener("click", function () {
    let sidebar = document.getElementById("sidebar");
    sidebar.style.right = "-400px";
  });
  
  //I generate an event to log the user out.
  buttonLogout.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/sessions/userLogout", {
        method: "POST",
        credentials: "same-origin",
      });
      const responseData = await response.json();
      if (responseData.status === "Success") {
        alert("You are logged out");
        window.location.replace("/login");
      } else {
        alert("Error logging out");
      }
    } catch (error) {
      console.log(error);
    }
  });
  
  //I bring user tickets for show in the view
  const getInfoUser = async () => {
    //I bring the user Data
    const responseUser = await fetch("/api/users/userProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataUser = await responseUser.json();
    const userId = responseDataUser.payload.id;
   
    //I bring the user tickets
    const responseTickets = await fetch(`/api/tickets/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataTickets = await responseTickets.json();
    const tickets = responseDataTickets.payload;
  
    if (tickets.length > 0) {
      tickets.forEach((item) => {
        const span = document.createElement("span");
        span.innerHTML = `<p>#${item.code} <b>TOTAL: ${item.amount}&pound;</b></p>`;
        purchasesContainer.append(span);
      });
    } else {
      purchasesContainer.innerHTML = `<div class="notPurchases"> 
                                      <p>At the moment no purchase has been registered</p>
                                      <button><a href="/">Go to shop</a></button>
                                    </div
                                    `;
    }
  
    const premiumUser = document.getElementById("premiumUser");
  
    if (responseDataUser.payload.role === "User") {
      premiumUser.innerHTML = `
                                <h4>Become a premium user and get many benefits:</h4>
                                <div class="buttonPremiumContainer">
                                  <button id="goPremium">Make me premium</button>
                                </div>
                              `;
  
      const buttonPremiumUser = document.getElementById("goPremium");
      buttonPremiumUser.addEventListener("click", async () => {
        const responsePremiumUser = await fetch(
          `/api/users/premium/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseDataPremium = await responsePremiumUser.json();
        if (responseDataPremium.status === "Success") {
          const responseLogOut = await fetch("/api/sessions/userLogout", {
            method: "POST",
            credentials: "same-origin",
          });
          const dataLogOut = await responseLogOut.json();
          if (dataLogOut.status === "Success") {
            alert("Now you are a premium user, please login again");
            window.location.replace("/login");
          }
        }
      });
    }
  };
  
  getInfoUser();
