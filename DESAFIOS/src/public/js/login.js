//I bring the neccesaries elements
const formLogin = document.getElementById("formLogin");
const formResetPass = document.getElementById("formResetPass");
const errorMessage = document.getElementById("errorMessage");
const errorResetPass = document.getElementById("errorResetPass");
const openModal = document.getElementById("buttonResetPassword");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("modalClose");
const passwordInput = document.getElementById("password");
const visibleButton = document.getElementById("visiblePass");
const buttonGitHub = document.getElementById("githubIcon")

//I delete the "active" field from localStorage
buttonGitHub.addEventListener("click", () => {
  localStorage.removeItem("active");
})

//Login form functionality
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  //I bring the user data entered and convert it to an object
  const dataUser = new FormData(formLogin);
  const objUser = {};
  dataUser.forEach((value, key) => (objUser[key] = value));
  //I verify if the user entered all fields and if the email has the required data
  if (!objUser.email || !objUser.password) {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Incomplete Fields";
  } else if(!/^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/.test(objUser.email)){
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Check the ingresed email";
  } else {
    //User login request
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(objUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
    //Answer of the request
    const responseData = await response.json();
    //Successful login, I redirect the user to the site
    if (responseData.status === "Success") {
      //I clear the field of localStorage("active") so that the user can make a purchase
      localStorage.removeItem("active");
      window.location.replace("/");
    }
    //Wrong answer, I show the error to the user
    if (responseData.status === "Error") {
      if (responseData.error === "too many tries") {
        window.location.replace("/register");
      }
      errorMessage.innerHTML = "";
      errorMessage.innerHTML = responseData.error;
    }
  }
});

//Logic to show and disappear the change password modal
openModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.add("modalShow");
});

modalClose.addEventListener("click", (e) => {
  console.log("ewefwefwef");
  e.preventDefault();
  errorResetPass.innerHTML = "";
  modal.classList.remove("modalShow");
});

//Logic to show or hide the entered password
visibleButton.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    visibleButton.classList.remove("fa-eye-slash");
    visibleButton.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    visibleButton.classList.remove("fa-eye");
    visibleButton.classList.add("fa-eye-slash");
  }
});

//Password reset form functionality
formResetPass.addEventListener("submit", async (e) => {
  e.preventDefault();
  //I bring the user data entered and convert it to an object
  const data = new FormData(formResetPass);
  const objData = {};
  data.forEach((value, key) => (objData[key] = value));
  //I verify if the user entered all fields
  if (!objData.email) {
    errorResetPass.innerHTML = "";
    errorResetPass.innerHTML = "Complete all fields";
  } else {
    //Reset password request
    const response = await fetch("/api/sessions/restoreRequest", {
      method: "POST",
      body: JSON.stringify(objData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    //Answer of the request
    const responseData = await response.json();
    //If the response return an success, I notify the user that an email was sent
    if (responseData.status === "Success") {
      errorResetPass.innerHTML = "";
      errorResetPass.innerHTML = "A verification email has been sent to you";
    }
    //If the response returns an error I show the error to the user
    if (responseData.status === "Error") {
      errorResetPass.innerHTML = "";
      errorResetPass.innerHTML = responseData.error;
    }
  }
});
