//I bring the necesaries elements
const formRestorePassword = document.getElementById("restorePassword");
const text = document.getElementById("errorResetPPass");

//I capture the data in the url
const urlParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});

//I generate an event for the change password form
formRestorePassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    //I bring the form data and the I convert it to an object
    const data = new FormData(formRestorePassword);
    const objData = {};
    data.forEach((value, key) => (objData[key] = value));
    //I introduce the user´s token in the object
    objData.token = urlParams.token
    //Valid if the password field is complete
    if (!objData.password) {
      errorResetPass.innerHTML = "";
      errorResetPass.innerHTML = "Complete all fields";
    } else {
      //Generate a request to change the user's password
      const response = await fetch("/api/sessions/restorePassword", {
        method: "POST",
        body: JSON.stringify(objData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();

      //if the password change was successful I redirect it to the login view otherwise I show the error
      if(responseData.status === "Success") {
        window.location.replace("/login")
      }
      if(responseData.status === "Error") {
        errorResetPass.innerHTML = "";
        errorResetPass.innerHTML = responseData.error
      }
    }
  });