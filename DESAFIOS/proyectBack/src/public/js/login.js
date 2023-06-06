const formLogin = document.getElementById('formLogin');
const errorMessage = document.getElementById("errorMessage");

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dataUser = new FormData(formLogin);
  const objUser = {};
  dataUser.forEach((value, key) => (objUser[key] = value));
  const response = await fetch('/api/sessions/login', {
    method: 'POST',
    body: JSON.stringify(objUser),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  if (responseData.status === 'Success') {
    window.location.replace('/products');
  }
  if(responseData.status === "Error") {
    errorMessage.innerHTML = "";
    errorMessage.innerHTML = responseData.error;
  }
});

