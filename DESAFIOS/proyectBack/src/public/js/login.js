const formLogin = document.getElementById("formLogin");
const formResetPass = document.getElementById("formResetPass");
const errorMessage = document.getElementById("errorMessage");
const errorResetPass = document.getElementById("errorResetPass");
const openModal = document.getElementById("buttonResetPassword");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("modalClose");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dataUser = new FormData(formLogin);
  const objUser = {};
  dataUser.forEach((value, key) => (objUser[key] = value));
  if (!objUser.email || !objUser.password) {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Incomplete Fields";
  } else {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(objUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
     if (responseData.status === "Success") {
      window.location.replace("/products");
    }
    if (responseData.status === "Error") {
      if (responseData.error === "too many tries") {
        window.location.replace("/register");
      }
      errorMessage.innerHTML = "";
      errorMessage.innerHTML = responseData.error;
    } 
  }
});

openModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("modalShow");
});

modalClose.addEventListener("click", (e) => {
  e.preventDefault();
  errorResetPass.innerHTML = ""
  modal.classList.remove("modalShow");
});

formResetPass.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(formResetPass);
  const objData = {};
  data.forEach((value, key) => (objData[key] = value));
  console.log(objData);
  if (!objData.email || !objData.password) {
    errorResetPass.innerHTML = "";
    errorResetPass.innerHTML = "Complete all fields";
  } else {
    const response = await fetch("/api/sessions/restorePassword", {
      method: "POST",
      body: JSON.stringify(objData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if(responseData.status === "Success") {
      window.location.replace("/login")
    }
    if(responseData.status === "Error") {
      errorResetPass.innerHTML = "";
      errorResetPass.innerHTML = responseData.error
    }
  }
});
