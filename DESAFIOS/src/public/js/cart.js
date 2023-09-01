const cartListProduct = document.getElementById("cartList");
const totalPrice = document.getElementById("totalPrice");
const boxTotalPrice = document.getElementById("boxTotalPrice");
const buttonClearCart = document.getElementById("buttonClearCart");
const boxClearCart = document.getElementById("boxClearCart");
const buttomBox = document.getElementById("buttomBox");
const totalPriceTop = document.getElementById("totalPriceTop");
const totalCountTop = document.getElementById("totalCountCart");
const buttonFinishPurchase = document.getElementById("buttonFinishPurchase");

let productsCart = JSON.parse(localStorage.getItem("cart")) || [];
if (productsCart.length >= 1) {
  productsCart.map((item) => {
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

    //I show the totalPrice in the view
    const totalPriceValue = productsCart.reduce((acc, currentValue) => {
      return (acc += currentValue.price * currentValue.quantity);
    }, 0);
    totalPrice.innerHTML = totalPriceValue;

    //logic to remove a product from the cart
    const deleteProductCart = document.getElementById(item.id);
    deleteProductCart.addEventListener("click", async () => {
      //First i bring the user data for obtein your cartId
      const responseUser = await fetch("/api/users/userProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseDataUser = await responseUser.json();
      const userCartId = responseDataUser.payload.cart;

      //Second I send the request to remove the product from the cart
      const responseDeleteProduct = await fetch(
        `/api/carts/${userCartId}/product/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseDataDelete = await responseDeleteProduct.json();
      if (responseDataDelete.status === "Success") {
        const buttonDeleteProduct = productsCart.find(
          (product) => product.id === item.id
        );
        const index = productsCart.indexOf(buttonDeleteProduct);
        productsCart.splice(index, 1);
        cartListProduct.removeChild(boxCart);
        productsCart.filter((products) => products.id != item.id);
        localStorage.setItem("cart", JSON.stringify(productsCart));
        const newPrice = productsCart.reduce(
          (acc, currentValue) =>
            (acc += currentValue.price * currentValue.quantity),
          0
        );
        totalPrice.innerHTML = newPrice;
        totalPriceTop.innerHTML = newPrice;
      }
    });
  });

  buttonClearCart.addEventListener("click", async () => {
    //First i bring the user data for obtein your cartId
    const responseUser = await fetch("/api/users/userProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataUser = await responseUser.json();
    const userCartId = responseDataUser.payload.cart;

    //Second I send the request to remove the product from the cart
    const responseClearCart = await fetch(`/api/carts/${userCartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataClearCart = await responseClearCart.json();
    if (responseDataClearCart.status === "Success") {
      localStorage.removeItem("cart");
      cartListProduct.innerHTML = ` 
                                        <h4>the cart is empty</h4>
                                        `;
      boxTotalPrice.innerHTML = "";
      buttonClearCart.innerHTML = `
                                            <a href="/">Go to home</a>
                                        `;
      buttomBox.innerHTML = "";
      totalCountTop.innerHTML = 0;
      totalPriceTop.innerHTML = 0;
    }
  });

  buttonFinishPurchase.addEventListener("click", async () => {
    const purchasesInSession = JSON.parse(localStorage.getItem("active")) || {
      status: "Desactive",
    };
    if (purchasesInSession.status === "Active") {
      return alert(
        "To be able to make another purchase you have to log in again"
      );
    }

    //I get the user data
    const responseUser = await fetch("/api/users/userProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataUser = await responseUser.json();
    const emailUser = responseDataUser.payload.email;
    const cartUser = responseDataUser.payload.cart;

    //I purchasing process
    const responsePurchase = await fetch(`/api/carts/${cartUser}/purchase`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseDataPurchase = await responsePurchase.json();
    if (responseDataPurchase.status === "Success") {
      //I create the necessary data to finalize the purchase
      if (responseDataPurchase.payload.productsAvailable.length === 0)
        return alert(
          "there is no stock available on any of the products in the cart"
        );
      const productsNotAvailable =
        responseDataPurchase.payload.productsNotAvailable;
      const totalPricePurchase = responseDataPurchase.payload.totalPrice;
      const code = Math.random() * 10;
      const date = new Date().toLocaleString();

      const modalFinishPurchase = document.getElementById("modalDiscount");
      const modalContent = document.getElementById("modalDiscountContent");

      let ticket;
      if (productsNotAvailable.length > 0) {
        modalContent.innerHTML = `
                                  <h3>Thank you for your purchase</h3>
                                  <span><p>CODE: <b>${code}</b></p></span>
                                  <span><p>DATE: <b>${date}</b></p></span>
                                  <span><p>YOUR EMAIL: <b>${emailUser}</b></p></span>
                                  <span><p>THE TOTAL PRICE IS: <b id="ticketTotalPrice">${totalPricePurchase}</b></p></span>
                                  <h2>The following products were not included in the purchase</h2>
                                  <div id="productsNotAvailable"></div>
                                  <div class="discountBox">
                                    <h3>Do you have a discount coupon?</h3>
                                    <p>applying discount code the final price will be reduced by 15%</p>
                                    <form action="" id="formDiscount">
                                      <input class="control" id="valueDiscount" name="discountCode" placeholder="discount code">
                                      <input class="submitButton" type="submit" value="apply">
                                    </form>
                                  </div>
                                  <button id="notCode">I don't have a discount code</button>
                                  `;
        const notAvailableList = document.getElementById(
          "productsNotAvailable"
        );
        notAvailableList.innerHTML = "";
        for (const producto of productsNotAvailable) {
          const li = document.createElement("li");
          li.textContent = producto.product.title;
          notAvailableList.appendChild(li);
        }
        const notCode = document.getElementById("notCode");
        notCode.addEventListener("click", async () => {
          ticket = {
            code,
            date,
            finalPrice: totalPricePurchase,
            emailUser,
          };
          const responseTicket = await fetch("/api/tickets", {
            method: "POST",
            body: JSON.stringify(ticket),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseDataTicket = await responseTicket.json();
          if (responseDataTicket.status === "Success") {
            alert("ticket generado");
            const listProductsCart = productsNotAvailable.map((item) => {
              return {
                title: item.product.title,
                price: item.product.price,
                img: item.product.img,
                quantity: item.quantity,
                id: item.product._id,
              };
            });
            localStorage.setItem("cart", JSON.stringify(listProductsCart));
            location.reload();
          }
        });

        const formDiscount = document.getElementById("formDiscount");
        formDiscount.addEventListener("submit", async (e) => {
          e.preventDefault();
          const discountCode = new FormData(formDiscount);
          const objDiscountCode = {};
          discountCode.forEach((value, key) => (objDiscountCode[key] = value));

          const responseUser = await fetch("/api/users/userProfile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseDataUser = await responseUser.json();
          const dicountCodeUser = responseDataUser.payload.discountCode;
          const discountCodeEntered = parseInt(objDiscountCode.discountCode);
          if (dicountCodeUser != discountCodeEntered) {
            alert("Incorrect code");
          } else {
            alert("Code apllied");
            //I make a request to inform that the code was applied
            const responseCode = await fetch("/api/users/codeUserAplicated", {
              method: "PUT",
              body: JSON.stringify(objDiscountCode),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const responseCodeData = await responseCode.json();
            if (responseCodeData.status === "Success") {
              localStorage.setItem(
                "active",
                JSON.stringify({ status: "Active" })
              );
            }
            const priceTicket = document.getElementById("ticketTotalPrice");
            const price = totalPricePurchase;
            const discount = 15;
            const newPrice = (price * discount) / 100;
            priceTicket.innerHTML = totalPricePurchase - newPrice;
            const finalPrice = priceTicket.innerHTML;
            ticket = {
              code,
              date,
              finalPrice,
              emailUser,
            };
            //I create the ticket
            const responseTicket = await fetch("/api/tickets", {
              method: "POST",
              body: JSON.stringify(ticket),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const responseDataTicket = await responseTicket.json();
            if (responseDataTicket.status === "Success") {
              alert("thank you for your purchase");
              const listProductsCart = productsNotAvailable.map((item) => {
                return {
                  title: item.product.title,
                  price: item.product.price,
                  img: item.product.img,
                  quantity: item.quantity,
                  id: item.product._id,
                };
              });
              localStorage.setItem("cart", JSON.stringify(listProductsCart));
              location.reload();
            }
          }
        });
        modalFinishPurchase.style.display = "flex";
        setTimeout(() => {
          modalFinishPurchase.classList.add("mostrar");
        }, 50);
      } else {
        modalContent.innerHTML = `
                                  <h3>Thank you for your purchase</h3>
                                  <span><p>CODE: <b>${code}</b></p></span>
                                  <span><p>DATE: <b>${date}</b></p></span>
                                  <span><p>YOUR EMAIL: <b>${emailUser}</b></p></span>
                                  <span><p>THE TOTAL PRICE IS: <b id="ticketTotalPrice">${totalPricePurchase}</b></p></span>
                                  <div class="discountBox">
                                    <h3>Do you have a discount coupon?</h3>
                                    <form action="" id="formDiscount">
                                      <input class="control" id="valueDiscount" name="discountCode" placeholder="discount code">
                                      <input class="submitButton" type="submit" value="apply">
                                    </form>
                                  </div>
                                  <button id="notCode">I don't have a discount code</button>
                                 `;

        const notCode = document.getElementById("notCode");
        notCode.addEventListener("click", async () => {
          ticket = {
            code,
            date,
            finalPrice: totalPricePurchase,
            emailUser,
          };
          const responseTicket = await fetch("/api/tickets", {
            method: "POST",
            body: JSON.stringify(ticket),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseDataTicket = await responseTicket.json();
          if (responseDataTicket.status === "Success") {
            alert("ticket generado");
            const listProductsCart = productsNotAvailable.map((item) => {
              return {
                title: item.product.title,
                price: item.product.price,
                img: item.product.img,
                quantity: item.quantity,
                id: item.product._id,
              };
            });
            localStorage.setItem("cart", JSON.stringify(listProductsCart));
            location.reload();
          }
        });

        const formDiscount = document.getElementById("formDiscount");
        formDiscount.addEventListener("submit", async (e) => {
          e.preventDefault();
          const discountCode = new FormData(formDiscount);
          const objDiscountCode = {};
          discountCode.forEach((value, key) => (objDiscountCode[key] = value));

          const responseUser = await fetch("/api/users/userProfile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const responseDataUser = await responseUser.json();
          const dicountCodeUser = responseDataUser.payload.discountCode;
          const discountCodeEntered = parseInt(objDiscountCode.discountCode);

          if (dicountCodeUser != discountCodeEntered) {
            alert("Incorrect code");
          } else {
            alert("Applied code");
            //I make a request to inform that the code was applied
            const responseCode = await fetch("/api/users/codeUserAplicated", {
              method: "PUT",
              body: JSON.stringify(objDiscountCode),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const responseCodeData = await responseCode.json();
            if (responseCodeData.status === "Success") {
              localStorage.setItem(
                "active",
                JSON.stringify({ status: "Active" })
              );
            }
            const priceTicket = document.getElementById("ticketTotalPrice");
            const price = totalPricePurchase;
            const discount = 15;
            const newPrice = (price * discount) / 100;
            priceTicket.innerHTML = totalPricePurchase - newPrice;
            const finalPrice = priceTicket.innerHTML;
            ticket = {
              code,
              date,
              finalPrice,
              emailUser,
            };
            //I create the ticket
            const responseTicket = await fetch("/api/tickets", {
              method: "POST",
              body: JSON.stringify(ticket),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const responseDataTicket = await responseTicket.json();
            if (responseDataTicket.status === "Success") {
              alert("ticket generado");
              const listProductsCart = productsNotAvailable.map((item) => {
                return {
                  title: item.product.title,
                  price: item.product.price,
                  img: item.product.img,
                  quantity: item.quantity,
                  id: item.product._id,
                };
              });
              localStorage.setItem("cart", JSON.stringify(listProductsCart));
              location.reload();
            }
          }
        });
        modalFinishPurchase.style.display = "flex";
        setTimeout(() => {
          modalFinishPurchase.classList.add("mostrar");
        }, 50);
      }
    }
  });
} else {
  cartListProduct.innerHTML = `
                                    <h4>the cart is empty</h4> 
                                `;
}
