//I bring the elements I need 
const formRegister = document.getElementById("formRegister");
const errorMessage = document.getElementById("errorMessage");

//Trigger an event when you press the registration button 
formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();

  //I capture the sent fields and transform them into an object
  const data = new FormData(formRegister);
  const dataObject = {};
  data.forEach((value, key) => (dataObject[key] = value));
  //I verify certain fields
  if(!dataObject.email || !dataObject.password || !dataObject.first_name || !dataObject.last_name || !dataObject.age || !dataObject.confirmPassword) {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Incomplete fields"
  } else if(dataObject.age < 18){
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Sorry, you must be of legal age to register"
  }else if(!/^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com)$/.test(dataObject.email)) {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Please chek if your email is correct"
  }else if(dataObject.password != dataObject.confirmPassword ){
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = "Passwords not match";
  } else {
    //I make the registration request
    const responseRegist = await fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(dataObject),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseDataRegist = await responseRegist.json();
    if (responseDataRegist.status === "Success") {
      window.location.replace("/login");
    }
    if (responseDataRegist.status === "Error") {
      errorMessage.innerHTML = "";
      errorMessage.innerHTML = responseDataRegist.error
    }
  }
});

