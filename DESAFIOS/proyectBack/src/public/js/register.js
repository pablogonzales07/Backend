const formRegister = document.getElementById("formRegister");
const errorMessage = document.getElementById("errorMessage");

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(formRegister);
  const dataObject = {};
  data.forEach((value, key) => (dataObject[key] = value));
  if(!dataObject.email || !dataObject.password || !dataObject.first_name || !dataObject.last_name) {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Incomplete fields"
  } else {
    const response = await fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(dataObject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (responseData.status === "Success") {
      window.location.replace("/login");
    }
    if (responseData.status === "Error") {
      errorMessage.innerHTML = "";
      errorMessage.innerHTML = responseData.error[responseData.error.length - 1]
    }
  }
});

